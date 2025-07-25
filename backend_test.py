#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Travel Booking Platform
Tests all endpoints and functionality as specified in the review request.
"""

import requests
import json
import sys
from datetime import datetime, date, timedelta
from typing import Dict, List, Any
import uuid

# Backend URL from frontend/.env
BACKEND_URL = "https://5a206429-6e83-4f7e-b422-bdd09a4366fc.preview.emergentagent.com/api"

class TravelBookingAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = []
        self.sample_destination_ids = []
        self.sample_hotel_ids = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        print()
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details,
            'response_data': response_data
        })
    
    def test_api_health_check(self):
        """Test GET /api/ endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Travel Booking Platform" in data["message"]:
                    self.log_test("API Health Check", True, f"Status: {response.status_code}, Message: {data['message']}")
                    return True
                else:
                    self.log_test("API Health Check", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("API Health Check", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("API Health Check", False, f"Exception: {str(e)}")
            return False
    
    def test_get_all_destinations(self):
        """Test GET /api/destinations (fetch all destinations)"""
        try:
            response = self.session.get(f"{BACKEND_URL}/destinations")
            
            if response.status_code == 200:
                destinations = response.json()
                if isinstance(destinations, list) and len(destinations) > 0:
                    # Store sample destination IDs for later tests
                    self.sample_destination_ids = [dest['id'] for dest in destinations[:3]]
                    
                    # Verify sample destinations are present
                    destination_names = [dest['name'] for dest in destinations]
                    expected_destinations = ['Paris', 'Bali', 'Swiss Alps', 'New York City', 'Dubai Desert', 'Maldives']
                    found_destinations = [name for name in expected_destinations if name in destination_names]
                    
                    self.log_test("Get All Destinations", True, 
                                f"Found {len(destinations)} destinations, including: {', '.join(found_destinations)}")
                    return True
                else:
                    self.log_test("Get All Destinations", False, "No destinations found or invalid format", destinations)
                    return False
            else:
                self.log_test("Get All Destinations", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get All Destinations", False, f"Exception: {str(e)}")
            return False
    
    def test_filter_destinations_by_type(self):
        """Test GET /api/destinations?type=beach (filter by type)"""
        try:
            response = self.session.get(f"{BACKEND_URL}/destinations?type=beach")
            
            if response.status_code == 200:
                destinations = response.json()
                if isinstance(destinations, list):
                    beach_destinations = [dest['name'] for dest in destinations if dest.get('type') == 'beach']
                    expected_beach = ['Bali', 'Maldives']
                    found_beach = [name for name in expected_beach if name in beach_destinations]
                    
                    self.log_test("Filter Destinations by Type (Beach)", True, 
                                f"Found {len(destinations)} beach destinations: {', '.join(beach_destinations)}")
                    return True
                else:
                    self.log_test("Filter Destinations by Type (Beach)", False, "Invalid response format", destinations)
                    return False
            else:
                self.log_test("Filter Destinations by Type (Beach)", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Filter Destinations by Type (Beach)", False, f"Exception: {str(e)}")
            return False
    
    def test_search_destinations(self):
        """Test POST /api/destinations/search with various search queries"""
        search_tests = [
            {"query": "Paris", "expected_contains": "Paris"},
            {"query": "beach", "expected_type": "beach"},
            {"query": "France", "expected_contains": "Paris"},
            {"query": "mountain", "expected_type": "mountain"}
        ]
        
        all_passed = True
        for search_test in search_tests:
            try:
                search_data = {"query": search_test["query"]}
                response = self.session.post(f"{BACKEND_URL}/destinations/search", 
                                           json=search_data)
                
                if response.status_code == 200:
                    destinations = response.json()
                    if isinstance(destinations, list):
                        if "expected_contains" in search_test:
                            found = any(search_test["expected_contains"] in dest.get('name', '') or 
                                      search_test["expected_contains"] in dest.get('country', '') or
                                      search_test["expected_contains"] in dest.get('description', '') 
                                      for dest in destinations)
                            if found:
                                self.log_test(f"Search Destinations - '{search_test['query']}'", True, 
                                            f"Found relevant results")
                            else:
                                self.log_test(f"Search Destinations - '{search_test['query']}'", False, 
                                            f"No relevant results found")
                                all_passed = False
                        elif "expected_type" in search_test:
                            found = any(dest.get('type') == search_test["expected_type"] for dest in destinations)
                            if found:
                                self.log_test(f"Search Destinations - '{search_test['query']}'", True, 
                                            f"Found destinations of type {search_test['expected_type']}")
                            else:
                                self.log_test(f"Search Destinations - '{search_test['query']}'", False, 
                                            f"No destinations of type {search_test['expected_type']} found")
                                all_passed = False
                    else:
                        self.log_test(f"Search Destinations - '{search_test['query']}'", False, 
                                    "Invalid response format", destinations)
                        all_passed = False
                else:
                    self.log_test(f"Search Destinations - '{search_test['query']}'", False, 
                                f"Status: {response.status_code}", response.text)
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Search Destinations - '{search_test['query']}'", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_get_individual_destination(self):
        """Test GET /api/destinations/{id} for individual destination details"""
        if not self.sample_destination_ids:
            self.log_test("Get Individual Destination", False, "No destination IDs available for testing")
            return False
        
        try:
            destination_id = self.sample_destination_ids[0]
            response = self.session.get(f"{BACKEND_URL}/destinations/{destination_id}")
            
            if response.status_code == 200:
                destination = response.json()
                required_fields = ['id', 'name', 'country', 'description', 'type', 'rating', 'latitude', 'longitude']
                missing_fields = [field for field in required_fields if field not in destination]
                
                if not missing_fields:
                    self.log_test("Get Individual Destination", True, 
                                f"Retrieved destination: {destination.get('name')} with all required fields")
                    return True
                else:
                    self.log_test("Get Individual Destination", False, 
                                f"Missing required fields: {missing_fields}")
                    return False
            else:
                self.log_test("Get Individual Destination", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get Individual Destination", False, f"Exception: {str(e)}")
            return False
    
    def test_get_hotels(self):
        """Test GET /api/hotels endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/hotels")
            
            if response.status_code == 200:
                hotels = response.json()
                if isinstance(hotels, list):
                    self.log_test("Get Hotels", True, f"Retrieved {len(hotels)} hotels")
                    if hotels:
                        self.sample_hotel_ids = [hotel['id'] for hotel in hotels[:2]]
                    return True
                else:
                    self.log_test("Get Hotels", False, "Invalid response format", hotels)
                    return False
            else:
                self.log_test("Get Hotels", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get Hotels", False, f"Exception: {str(e)}")
            return False
    
    def test_filter_hotels_by_destination(self):
        """Test hotel filtering by destination_id"""
        if not self.sample_destination_ids:
            self.log_test("Filter Hotels by Destination", False, "No destination IDs available for testing")
            return False
        
        try:
            destination_id = self.sample_destination_ids[0]
            response = self.session.get(f"{BACKEND_URL}/hotels?destination_id={destination_id}")
            
            if response.status_code == 200:
                hotels = response.json()
                if isinstance(hotels, list):
                    # Check if all returned hotels belong to the specified destination
                    valid_hotels = all(hotel.get('destination_id') == destination_id for hotel in hotels)
                    if valid_hotels:
                        self.log_test("Filter Hotels by Destination", True, 
                                    f"Found {len(hotels)} hotels for destination {destination_id}")
                        return True
                    else:
                        self.log_test("Filter Hotels by Destination", False, 
                                    "Some hotels don't match the destination filter")
                        return False
                else:
                    self.log_test("Filter Hotels by Destination", False, "Invalid response format", hotels)
                    return False
            else:
                self.log_test("Filter Hotels by Destination", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Filter Hotels by Destination", False, f"Exception: {str(e)}")
            return False
    
    def test_get_bookings(self):
        """Test GET /api/bookings endpoint"""
        try:
            response = self.session.get(f"{BACKEND_URL}/bookings")
            
            if response.status_code == 200:
                bookings = response.json()
                if isinstance(bookings, list):
                    self.log_test("Get Bookings", True, f"Retrieved {len(bookings)} bookings")
                    return True
                else:
                    self.log_test("Get Bookings", False, "Invalid response format", bookings)
                    return False
            else:
                self.log_test("Get Bookings", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Get Bookings", False, f"Exception: {str(e)}")
            return False
    
    def test_create_booking(self):
        """Test booking creation functionality"""
        if not self.sample_destination_ids:
            self.log_test("Create Booking", False, "No destination IDs available for testing")
            return False
        
        try:
            booking_data = {
                "user_name": "John Smith",
                "user_email": "john.smith@example.com",
                "destination_id": self.sample_destination_ids[0],
                "check_in": (date.today() + timedelta(days=30)).isoformat(),
                "check_out": (date.today() + timedelta(days=35)).isoformat(),
                "guests": 2,
                "total_price": 1500.00,
                "special_requests": "Ocean view room preferred"
            }
            
            response = self.session.post(f"{BACKEND_URL}/bookings", json=booking_data)
            
            if response.status_code == 200:
                booking = response.json()
                required_fields = ['id', 'user_name', 'user_email', 'destination_id', 'status']
                missing_fields = [field for field in required_fields if field not in booking]
                
                if not missing_fields:
                    self.log_test("Create Booking", True, 
                                f"Created booking with ID: {booking.get('id')}")
                    return True
                else:
                    self.log_test("Create Booking", False, 
                                f"Missing required fields in response: {missing_fields}")
                    return False
            else:
                self.log_test("Create Booking", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("Create Booking", False, f"Exception: {str(e)}")
            return False
    
    def test_ai_recommendations(self):
        """Test POST /api/recommendations endpoint"""
        try:
            preferences_data = {
                "budget": "medium",
                "interests": ["culture", "food", "history"],
                "travel_style": "relaxed",
                "duration": "7 days"
            }
            
            response = self.session.post(f"{BACKEND_URL}/recommendations", json=preferences_data)
            
            if response.status_code == 200:
                recommendations = response.json()
                if isinstance(recommendations, dict) and "message" in recommendations:
                    # This is a placeholder endpoint, so we expect a message about OpenAI configuration
                    if "mock_recommendations" in recommendations:
                        self.log_test("AI Recommendations", True, 
                                    "Placeholder endpoint working, returns mock recommendations")
                        return True
                    else:
                        self.log_test("AI Recommendations", False, 
                                    "Missing mock_recommendations in response")
                        return False
                else:
                    self.log_test("AI Recommendations", False, "Invalid response format", recommendations)
                    return False
            else:
                self.log_test("AI Recommendations", False, f"Status: {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("AI Recommendations", False, f"Exception: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        error_tests = [
            {
                "name": "Invalid Destination ID",
                "url": f"{BACKEND_URL}/destinations/invalid-id",
                "method": "GET",
                "expected_status": 404
            },
            {
                "name": "Invalid Booking Data",
                "url": f"{BACKEND_URL}/bookings",
                "method": "POST",
                "data": {"invalid": "data"},
                "expected_status": 422
            }
        ]
        
        all_passed = True
        for test in error_tests:
            try:
                if test["method"] == "GET":
                    response = self.session.get(test["url"])
                elif test["method"] == "POST":
                    response = self.session.post(test["url"], json=test.get("data", {}))
                
                if response.status_code == test["expected_status"]:
                    self.log_test(f"Error Handling - {test['name']}", True, 
                                f"Correctly returned status {response.status_code}")
                else:
                    self.log_test(f"Error Handling - {test['name']}", False, 
                                f"Expected status {test['expected_status']}, got {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Error Handling - {test['name']}", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print("=" * 80)
        print("TRAVEL BOOKING PLATFORM - BACKEND API TESTING")
        print("=" * 80)
        print()
        
        # Test sequence based on dependencies
        tests = [
            ("API Health Check", self.test_api_health_check),
            ("Get All Destinations", self.test_get_all_destinations),
            ("Filter Destinations by Type", self.test_filter_destinations_by_type),
            ("Search Destinations", self.test_search_destinations),
            ("Get Individual Destination", self.test_get_individual_destination),
            ("Get Hotels", self.test_get_hotels),
            ("Filter Hotels by Destination", self.test_filter_hotels_by_destination),
            ("Get Bookings", self.test_get_bookings),
            ("Create Booking", self.test_create_booking),
            ("AI Recommendations", self.test_ai_recommendations),
            ("Error Handling", self.test_error_handling)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            if test_func():
                passed += 1
        
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        if passed == total:
            print("🎉 ALL TESTS PASSED! Backend API is working correctly.")
        else:
            print("⚠️  Some tests failed. Please check the details above.")
        
        return passed == total

if __name__ == "__main__":
    tester = TravelBookingAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)
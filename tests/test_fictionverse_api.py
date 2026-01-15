"""
Fictionverse API Backend Tests
Tests for: Auth, Universes, Stories, Characters, Lore endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test user credentials
TEST_USER = {
    "username": f"TEST_user_{uuid.uuid4().hex[:8]}",
    "email": f"TEST_{uuid.uuid4().hex[:8]}@fictionverse.io",
    "password": "testpassword123"
}


class TestHealthCheck:
    """Basic API health check tests"""
    
    def test_api_root(self):
        """Test API root endpoint returns operational status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "operational"
        assert "Fictionverse" in data["message"]


class TestAuthEndpoints:
    """Authentication endpoint tests"""
    
    def test_signup_success(self):
        """Test user signup creates account"""
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=TEST_USER)
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == TEST_USER["email"]
        assert data["user"]["username"] == TEST_USER["username"]
    
    def test_signup_duplicate_email(self):
        """Test signup with existing email fails"""
        # First signup
        user = {
            "username": f"TEST_dup_{uuid.uuid4().hex[:8]}",
            "email": f"TEST_dup_{uuid.uuid4().hex[:8]}@fictionverse.io",
            "password": "testpassword123"
        }
        requests.post(f"{BASE_URL}/api/auth/signup", json=user)
        
        # Try duplicate
        user["username"] = "different_name"
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=user)
        assert response.status_code == 400
    
    def test_login_success(self):
        """Test login with valid credentials"""
        # Create user first
        user = {
            "username": f"TEST_login_{uuid.uuid4().hex[:8]}",
            "email": f"TEST_login_{uuid.uuid4().hex[:8]}@fictionverse.io",
            "password": "testpassword123"
        }
        requests.post(f"{BASE_URL}/api/auth/signup", json=user)
        
        # Login
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": user["email"],
            "password": user["password"]
        })
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == user["email"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials fails"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@fictionverse.io",
            "password": "wrongpassword"
        })
        assert response.status_code == 401


class TestUniversesEndpoints:
    """Universe CRUD endpoint tests"""
    
    def test_get_universes(self):
        """Test fetching all universes"""
        response = requests.get(f"{BASE_URL}/api/universes")
        assert response.status_code == 200
        data = response.json()
        assert "original" in data
        assert "inspired" in data
        assert isinstance(data["original"], list)
        assert isinstance(data["inspired"], list)
    
    def test_get_universes_has_seeded_data(self):
        """Test that seeded universes exist"""
        response = requests.get(f"{BASE_URL}/api/universes")
        assert response.status_code == 200
        data = response.json()
        
        # Check for seeded universes
        all_universes = data["original"] + data["inspired"]
        titles = [u["title"] for u in all_universes]
        
        # Should have at least some seeded data
        assert len(all_universes) > 0
        # Check for Neon Shadows (has chapters, characters, lore)
        assert "Neon Shadows" in titles
    
    def test_get_universe_by_id(self):
        """Test fetching single universe by title"""
        response = requests.get(f"{BASE_URL}/api/universes/Neon%20Shadows")
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Neon Shadows"
        assert data["type"] == "Original"
        assert "author" in data
        assert "description" in data
    
    def test_get_universe_not_found(self):
        """Test fetching non-existent universe returns 404"""
        response = requests.get(f"{BASE_URL}/api/universes/NonExistentUniverse12345")
        assert response.status_code == 404


class TestStoriesEndpoints:
    """Stories/Chapters endpoint tests"""
    
    def test_get_stories_by_universe(self):
        """Test fetching stories for a universe"""
        response = requests.get(f"{BASE_URL}/api/stories/Neon%20Shadows")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2  # Seeded with 2 chapters
    
    def test_get_stories_sorted_by_chapter(self):
        """Test stories are sorted by chapter number"""
        response = requests.get(f"{BASE_URL}/api/stories/Neon%20Shadows")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 1:
            for i in range(len(data) - 1):
                assert data[i]["chapter_number"] <= data[i+1]["chapter_number"]
    
    def test_get_story_chapter(self):
        """Test fetching specific chapter"""
        response = requests.get(f"{BASE_URL}/api/stories/Neon%20Shadows/1")
        assert response.status_code == 200
        data = response.json()
        assert data["chapter_number"] == 1
        assert data["universe_id"] == "Neon Shadows"
        assert "title" in data
        assert "content" in data
        assert len(data["content"]) > 0
    
    def test_get_story_chapter_not_found(self):
        """Test fetching non-existent chapter returns 404"""
        response = requests.get(f"{BASE_URL}/api/stories/Neon%20Shadows/999")
        assert response.status_code == 404


class TestCharactersEndpoints:
    """Characters endpoint tests"""
    
    def test_get_characters_by_universe(self):
        """Test fetching characters for a universe"""
        response = requests.get(f"{BASE_URL}/api/characters/Neon%20Shadows")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2  # Seeded with 2 characters
    
    def test_characters_have_required_fields(self):
        """Test characters have all required fields"""
        response = requests.get(f"{BASE_URL}/api/characters/Neon%20Shadows")
        assert response.status_code == 200
        data = response.json()
        
        for character in data:
            assert "name" in character
            assert "description" in character
            assert "role" in character
            assert character["role"] in ["protagonist", "antagonist", "supporting"]


class TestLoreEndpoints:
    """Lore endpoint tests"""
    
    def test_get_lore_by_universe(self):
        """Test fetching lore for a universe"""
        response = requests.get(f"{BASE_URL}/api/lore/Neon%20Shadows")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2  # Seeded with 2 lore entries
    
    def test_lore_has_required_fields(self):
        """Test lore entries have all required fields"""
        response = requests.get(f"{BASE_URL}/api/lore/Neon%20Shadows")
        assert response.status_code == 200
        data = response.json()
        
        for entry in data:
            assert "title" in entry
            assert "content" in entry
            assert "category" in entry


class TestClubsEndpoints:
    """Clubs endpoint tests"""
    
    def test_get_clubs(self):
        """Test fetching all clubs"""
        response = requests.get(f"{BASE_URL}/api/clubs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestForumEndpoints:
    """Forum endpoint tests"""
    
    def test_get_forum_posts(self):
        """Test fetching forum posts"""
        response = requests.get(f"{BASE_URL}/api/forum/posts")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestChallengesEndpoints:
    """Challenges endpoint tests"""
    
    def test_get_challenges(self):
        """Test fetching challenges"""
        response = requests.get(f"{BASE_URL}/api/challenges")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestUniverseFilterEndpoints:
    """Universe filter endpoint tests"""
    
    def test_filter_by_genre(self):
        """Test filtering universes by genre"""
        response = requests.get(f"{BASE_URL}/api/universes/filter/Cyberpunk")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        for universe in data:
            assert universe["genre"] == "Cyberpunk"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

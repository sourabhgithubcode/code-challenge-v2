import pytest
from datetime import date

from django.shortcuts import reverse
from rest_framework.test import APIClient

from map.models import CommunityArea, RestaurantPermit


@pytest.mark.django_db
def test_map_data_view():
    # Create some test community areas
    area1 = CommunityArea.objects.create(name="Beverly", area_id="1")
    area2 = CommunityArea.objects.create(name="Lincoln Park", area_id="2")

    # Test permits for Beverly
    RestaurantPermit.objects.create(
        community_area_id=area1.area_id, issue_date=date(2021, 1, 15)
    )
    RestaurantPermit.objects.create(
        community_area_id=area1.area_id, issue_date=date(2021, 2, 20)
    )

    # Test permits for Lincoln Park
    RestaurantPermit.objects.create(
        community_area_id=area2.area_id, issue_date=date(2021, 3, 10)
    )
    RestaurantPermit.objects.create(
        community_area_id=area2.area_id, issue_date=date(2021, 2, 14)
    )
    RestaurantPermit.objects.create(
        community_area_id=area2.area_id, issue_date=date(2021, 6, 22)
    )

    # Query the map data endpoint
    client = APIClient()
    response = client.get(reverse("map_data") + "?year=2021")

    # TODO: Complete the test by asserting that the /map-data/ endpoint
    # returns the correct number of permits for Beverly and Lincoln
    # Park in 2021

    assert response.status_code == 200
    data = response.json()

    # Convert response data to a dictionary keyed by area name for easier lookup
    areas_by_name = {area["name"]: area for area in data}

    # Beverly should have 2 permits in 2021
    assert "Beverly" in areas_by_name
    assert areas_by_name["Beverly"]["num_permits"] == 2
    assert areas_by_name["Beverly"]["area_id"] == 1

    # Lincoln Park should have 3 permits in 2021
    assert "Lincoln Park" in areas_by_name
    assert areas_by_name["Lincoln Park"]["num_permits"] == 3
    assert areas_by_name["Lincoln Park"]["area_id"] == 2

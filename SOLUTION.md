# DataMade Code Challenge Solution

This document outlines the implementation of all required features for the DataMade 2026 Code Challenge.

## Implementation Summary

### Step 1: Backend - Community Area Data Serialization
**File:** `map/serializers.py`

Implemented the `get_num_permits()` method to:
- Extract the year from the serializer context
- Query `RestaurantPermit` model filtering by:
  - `community_area_id` matching the community area's `area_id`
  - `issue_date__year` matching the requested year
- Return the count of permits for that area and year
- Added `area_id` to serializer fields for frontend data matching

### Step 2: Backend Testing
**File:** `tests/test_views.py`

Completed the `test_map_data_view()` test:
- Fixed the API endpoint call to properly append query parameters
- Added assertions to verify:
  - Response status code is 200
  - Beverly area returns 2 permits for 2021
  - Lincoln Park area returns 3 permits for 2021
  - Both areas include correct `area_id` values
- Converted response data to dictionary for easier lookup and validation

### Step 3: Frontend - Year Filter and Data Fetching
**File:** `map/static/js/RestaurantPermitMap.js`

Implemented data fetching:
- Fixed the `fetch()` call to use `yearlyDataEndpoint`
- Set fetched data to `currentYearData` state
- UseEffect triggers re-fetch when year changes

### Step 4: Frontend - Display Statistics
**File:** `map/static/js/RestaurantPermitMap.js`

Added statistics calculations and display:
- `totalPermits`: Sum of all permits across areas using `reduce()`
- `maxNumPermits`: Maximum permits in any single area using `Math.max()`
- Updated JSX to display both values in the UI

### Step 5: Frontend - Interactive Map
**File:** `map/static/js/RestaurantPermitMap.js`

Implemented dynamic map features:

**`getColor()` function:**
- Returns appropriate color from `communityAreaColors` array
- Based on percentage of permits (relative to max)
- Creates choropleth effect with 4 color levels

**`setAreaInteraction()` function:**
- Extracts area ID from GeoJSON feature properties
- Finds matching data from API response
- Calculates permit percentage for color shading
- Sets area style with:
  - Dynamic fill color based on permit density
  - White borders for clarity
  - Semi-transparent fill for better visibility
- Adds hover interactions:
  - Popup on `mouseover` showing area name and permit count
  - Popup closes on `mouseout`

## Key Features

1. **Year Filtering**: Dropdown allows users to select any year from 2016-2026
2. **Dynamic Choropleth Map**: Areas shade darker with more permits
3. **Interactive Popups**: Hover over areas to see detailed permit counts
4. **Statistics Display**: Shows total permits and maximum permits per area
5. **Automatic Updates**: Map and stats update automatically when year changes

## Technical Details

### Backend
- Used Django ORM's `filter()` and `count()` for efficient queries
- Proper type casting for year (int) and area_id (str) comparison
- Serializer context used to pass year parameter from view to serializer

### Frontend
- React hooks (`useState`, `useEffect`) for state management
- Proper dependency array in `useEffect` to trigger on year changes
- Leaflet/React-Leaflet for map rendering
- GeoJSON layer integration with custom styling and interactions

## How to Run

### Prerequisites
- Docker
- Docker Compose

### Setup Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-fork-url>
   cd code-challenge-v2
   ```

2. **Build the Docker containers**:
   ```bash
   docker compose build
   ```

3. **Load the fixture data**:
   ```bash
   docker compose run --rm app python manage.py loaddata map/fixtures/restaurant_permits.json map/fixtures/community_areas.json
   ```

4. **Start the application**:
   ```bash
   docker compose up
   ```

5. **Access the application**:
   Open your browser and navigate to [http://localhost:8000](http://localhost:8000)

### Running Tests

Execute the test suite with:
```bash
docker compose -f docker-compose.yml -f tests/docker-compose.yml run --rm app
```

## Implementation Highlights

- **Clean Code**: Well-commented, readable implementation
- **Error Handling**: Graceful handling of missing data (e.g., areas with 0 permits)
- **Performance**: Efficient database queries with single query per area
- **User Experience**: Smooth interactions with clear visual feedback
- **Testing**: Comprehensive test coverage for API endpoint

## Files Modified

1. `map/serializers.py` - Backend serializer logic
2. `map/static/js/RestaurantPermitMap.js` - Frontend React component
3. `tests/test_views.py` - Test implementation

## Notes

- The map uses a choropleth color scheme with 4 levels based on permit density
- Popup information includes both area name and specific permit count
- The year filter defaults to 2026 (most recent year)
- All TODOs from the original codebase have been completed

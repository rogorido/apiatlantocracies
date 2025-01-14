---
title: API details
---

# Route /search

## Body

It gets a object which is the filter we will apply.

## Response

Returns an object with the following structure:

| Item                   | Type   | Description                                         |
| ---------------------- | ------ | --------------------------------------------------- |
| result                 | array  | Array of persons.                                   |
| sourcesData            | array  | Array of sources data for table.                     |
| sourcesChartData       | object | Object for chartjs with sources data.                |
| gendersData            | array  | Array of gender data for table.                     |
| gendersChartData       | object | Object for chartjs with gender data.                |
| histBirthsData         | array  | Array of historical places for table.               |
| histBirthsChartData    | object | Object for chartjs with gender data.                |
| hasTitlesChartData     | object | Object for chartjs with data has/not has titles.    |
| hasTitlesData          | array  | Array of has/not has titles for table.              |
| hasPositionsChartData  | object | Object for chartjs with data has/not has positions. |
| hasPositionsData       | array  | Array of has/not has positions for table.           |
| positionsTable         | array  | Array of positions for table.                       |
| positionsTableTree     | object | Object for DataTree with positions.                 |
| decadesBirthsChartData | object | Object for chartjs with decades (births dates).     |

# Route /general/generalstats

# Route /groups/

## Body

It gets a object which is the filter we will apply.

## Response

Returns an object with the following structure (see details above about
the concrete infos in every object): 

| Item                  | Type   | Description                                                                 |
|-----------------------|--------|-----------------------------------------------------------------------------|
| personsDetails        | object | object with all the data of the person: events, etc. with normalized dates. |
| personsrelations      | array  | Array of persons with all the relations they have.                          |
| personsrelationstable | array  | Idem but in the format expected by the DataTable component of primevue.     |
| personsrelationscyto  | array  | Idem but in the format expected by cytoscape                                |
| placesrelated         | array  | Array of places related to the analyzed persons.                            |


### personsrelationscyto

The problem now is: there are very few data in the object: only id,
label (that is name) and type (mainperson, etc.). 





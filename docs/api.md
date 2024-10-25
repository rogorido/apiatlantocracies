---
title: API details
---

# Route /search

## Body

It gets a object which is the filter we will apply.

## Response

Returns an object with the following structure:

| Item                    | Type   | Description                                         |
| ----------------------- | ------ | --------------------------------------------------- |
| result,                 | array  | Array of persons.                                   |
| gendersData,            | array  | Array of gender data for table.                     |
| gendersChartData,       | object | Object for chartjs with gender data.                |
| histBirthsData,         | array  | Array of historical places for table.               |
| histBirthsChartData,    | object | Object for chartjs with gender data.                |
| hasTitlesChartData,     | object | Object for chartjs with data has/not has titles.    |
| hasTitlesData,          | array  | Array of has/not has titles for table.              |
| hasPositionsChartData,  | object | Object for chartjs with data has/not has positions. |
| hasPositionsData,       | array  | Array of has/not has positions for table.           |
| positionsTable,         | array  | Array of positions for table.                       |
| positionsTableTree,     | object | Object for DataTree with positions.                 |
| decadesBirthsChartData, | object | Object for chartjs with decades (births dates).     |

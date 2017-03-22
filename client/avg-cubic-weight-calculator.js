"use strict";

var baseUrl = "http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com",
  totalItems = 0,
  combinedCubicWeight = 0,
  averageCubicWeight;

function fetchSpecificElement(category) {
  return function(elem) {
    if (elem.category === category) {
      return elem;
    }
  }
}

function computeCubicWeight(size) {
  var width = size.width,
    height = size.height,
    length = size.length,
    cubicWeightConversionFactor = 250;

    return (width * height * length * cubicWeightConversionFactor)/1000000;
}

function fetchData(url) {
  var specifiedCategoriesFound = [];
  $.ajax({
    url: baseUrl + url,
    type: "GET",
    success: function(res) {
      processData(res.objects);
      if (res.next) {
        fetchData(res.next);
      } else {
        averageCubicWeight = computeAverageCubicWeight();
        $("#item-count").text(totalItems);
        $("#average-weight").text(averageCubicWeight + " Kg")
      }
    },
    error: function(err) {
      $("#error-message").text("Error in fetching Data. Please resolve CORS issue from server side");
      console.log(err);
    }
  });
}

function processData(data) {
  var cubicWeight;

  var specifiedCategoriesFound = data.filter(fetchSpecificElement("Air Conditioners"));

  specifiedCategoriesFound.forEach(function(item) {
    cubicWeight = computeCubicWeight(item.size);
    combinedCubicWeight += cubicWeight;
    totalItems ++;
  });
}

function computeAverageCubicWeight() {
  return combinedCubicWeight/totalItems;
}


 $(document).ready(function() {
  fetchData("/api/products/1")
});
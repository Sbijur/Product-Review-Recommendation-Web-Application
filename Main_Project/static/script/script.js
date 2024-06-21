document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchResultsList = document.getElementById("searchResults");
  const productCardsContainer = document.getElementById("productCards");
  const submitButton = document.getElementById("submitButton");

  // User profile
  const userProfileDiv = document.querySelector(".user-profile");


  // Add event listener to Logo
  const homeLink = document.getElementById("homeLink");
  // homeLink.addEventListener("click", function () {
  //   // Redirect to the home page
  //   window.location.href = "/"; // Change "/" to the URL of your home page
  // });  
  
  
  // ===================== Purchase History - START =====================
  const purchaseHistoryContainer = document.getElementById("purchaseHistory");
  let purch_hist_Allprod = [];

  // console.log("Login User ID:", loginUserID);

  Promise.all([
    fetch("/static/script/Product_Dataset.csv").then((response) =>
      response.text()
    ),
    fetch("/static/script/New_db_uid_hist.csv").then((response) =>
      response.text()
    ),
  ])
    .then(([productCsvData, purchaseCsvData]) => {
      // Parse CSV data
      const products = parseCsv(productCsvData);
      const purchaseHistory = parseCsv(purchaseCsvData);
      purch_hist_Allprod = products;

      const filteredPurchaseHistory = getFilterPurchaseHistory(
        purchaseHistory,
        loginUserID
      );
      displayPurchaseHistory(filteredPurchaseHistory);
    })
    .catch((error) => console.error("Error fetching CSV file:", error));

  // Function to get random indices
  function getRandomIndices() {
    const indices = [3099, 910, 180, 4079];
    return indices;
  }

  function getFilterPurchaseHistory(purchaseHistory, loginUserId) {
    // Filter purchase history based on the provided user ID
    const userPurchaseHistory = purchaseHistory.filter(
      (purchase) => purchase.customer_id === loginUserId
    );

    // console.log(userPurchaseHistory)
    return userPurchaseHistory;
  }

  /* 
  // Display purchase history
  function displayPurchaseHistory(products) {
    // Clear the existing content
    purchaseHistoryContainer.innerHTML = "";

    // Get random indices for selecting products
    const randomIndices = getRandomIndices();

    // Iterate through each product and create a purchase card
    randomIndices.forEach((index) => {
      const product = products[index];
      // Create a div element for the purchase card
      const purchaseCard = document.createElement("div");
      purchaseCard.classList.add("purchase-card");

      // Create an image element for the product picture
      const productImage = document.createElement("img");
      productImage.src = product.image; // Assuming product.image contains the URL of the image
      // productImage.alt = product.name;
      productImage.classList.add("user_profproduct_image");
      purchaseCard.appendChild(productImage);

      // Create a div element for the product details
      const productDetails = document.createElement("div");
      productDetails.classList.add("user_profproduct_details");

      // Set the content of the product details
      productDetails.innerHTML = `
          <p><b>Status:</b> Delivered ✅</p>
          <p><strong>${truncateText(product.name, 9)}</strong></p>
          <p>Category: ${product.categories}</p>
          <p>Price: ${product.actual_price}</p>
        `;

      // Append the product details to the purchase card
      purchaseCard.appendChild(productDetails);

      // Append the purchase card to the purchase history container
      purchaseHistoryContainer.appendChild(purchaseCard);
    });
  }
  */

  function displayPurchaseHistory(filteredPurchaseHistory) {
    // Clear the existing content
    purchaseHistoryContainer.innerHTML = "";

    // Iterate through each purchase and create a purchase card
    filteredPurchaseHistory.forEach((purchase) => {
      const productName = purchase.name;
      // const first7Words = productName.split(' ').slice(0, 8).join(' ');
      const matchedProduct = purch_hist_Allprod.find(
        (product) => product.name === productName
      );

      if (matchedProduct) {
        // Create a div element for the purchase card
        const purchaseCard = document.createElement("div");
        purchaseCard.classList.add("purchase-card");

        // Create an image element for the product picture
        const productImage = document.createElement("img");
        productImage.src = matchedProduct.image; // Assuming matchedProduct.image contains the URL of the image
        productImage.classList.add("user_profproduct_image");
        purchaseCard.appendChild(productImage);

        // Create a div element for the purchase details
        const purchaseDetails = document.createElement("div");
        purchaseDetails.classList.add("user_profproduct_details");

        // Set the content of the purchase details
        purchaseDetails.innerHTML = `
            <p><b>Status:</b> Delivered ✅</p>
            <p><strong>${truncateText(matchedProduct.name, 9)}</strong></p>
            <p>Category: ${matchedProduct.categories}</p>
            <p>Price: ${matchedProduct.actual_price}</p>
        `;

        // Append the purchase details to the purchase card
        purchaseCard.appendChild(purchaseDetails);

        // Append the purchase card to the purchase history container
        purchaseHistoryContainer.appendChild(purchaseCard);
      } else {
        console.log(
          `Product '${productName}' not found in the products dataset.`
        );
      }
    });
  }

  // ===================== Purchase History - END =====================


  // ----------------------- PRODUCT RECOMMEDNATIONS ----------------------- - START

    const recommendProductsContainer =
    document.getElementById("recommendProducts");

  fetch("/static/ProductRecommendations.csv")
    .then((response) => response.text())
    .then((csvData) => {
      const recommendations = parseCsv(csvData);

      // console.log(recommendations);
      // Get product names from recommendations
      const productNames = recommendations.map(
        (recommendation) => recommendation.RProducts
      );
      // Fetch Product_Dataset.csv
      fetch("/static/script/Product_Dataset.csv")
        .then((response) => response.text())
        .then((csvData) => {
          // Parse CSV data
          const products = parseCsv(csvData);

          // Filter products based on recommendations
          const recommendedProducts = products.filter((product) =>
            productNames.includes(product.name)
          );

          // console.log("Recommended Products:", recommendedProducts);

          // Display recommended products
          displayRecommendedProducts(recommendedProducts);
        })
        .catch((error) =>
          console.error("Error fetching Product_Dataset.csv:", error)
        );
    })
    .catch((error) => console.error("Error fetching CSV file:", error));


  // Function to display recommended products
  function displayRecommendedProducts(products) {
    products.forEach((product) => {
      // Create a div element for the recommended product card
      const recommendedProductCard = document.createElement("div");
      recommendedProductCard.classList.add("recommended-product-card");

      // Create an image element for the product picture
      const productImage = document.createElement("img");
      productImage.src = product.image; // Assuming product.image contains the URL of the image
      productImage.alt = product.name;
      productImage.classList.add("product-image");
      recommendedProductCard.appendChild(productImage);

      // Create a div element for the product details
      const productDetails = document.createElement("div");
      productDetails.classList.add("product-details");

      // Set the content of the product details
      productDetails.innerHTML = `
            <p><strong><a href="#" class="product-link" data-product-id="${
              product.name
            }">${truncateText(product.name, 10)}</a></strong></p>
            <p><strong>Category:</strong> ${product.categories}</p>
            <p><strong>Price:</strong> ${product.actual_price}</p>
            <a class="product-link-a" href="${
              product.link
            }" target="_blank" class="product-link">View Product</a>
        `;

      // Append the product details to the recommended product card
      recommendedProductCard.appendChild(productDetails);

      // Append the recommended product card to the recommend products container
      recommendProductsContainer.appendChild(recommendedProductCard);
    });

    // Add event listeners to product links
    const productLinks = document.querySelectorAll(".product-link");
    productLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = event.target.getAttribute("data-product-id");
        // Navigate to the product details page with productId
        window.location.href = `/product_expand.html?productId=${productId}`;
      });
    });
  }

  // ----------------------- PRODUCT RECOMMEDNATIONS ----------------------- - END


  // Press Enter function to - START

  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission behavior
      submitSearch();
    }
  });

  function submitSearch() {
    const typedword = searchInput.value;
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm.length > 0) {
      searchProducts(searchTerm, typedword);
    } else {
      clearSearchResults();
    }
  }
  // Press Enter function to - END


  // Display defaults products -- START
  displayDefaultProduct();

  function displayDefaultProduct() {

    const defaultProduct = [
      {
        name: "Noise Newly Launched Quad Call 1.81 Display Bluetooth Calling Smart Watch AI Voice Assistance 160 Hrs Battery Life Metallic Build in-Built Games 100 Sports Modes 100  Watch Faces Rose Pink",
        image: "https://m.media-amazon.com/images/I/61khLNWFnHL._AC_UY218_.jpg", // Replace with actual image URL
        link: "https://www.amazon.in/Noise-Launched-Bluetooth-Assistance-Metallic/dp/B0BW4BFBD5/ref=sr_1_15?dib=eyJ2IjoiMSJ9.UphRBEhQttk9ADot4yzQ0yDmtQFv1cYmaiftNDn17fT69hk8TjAsxASn7EzH2z0NcPTHQZShn7Xy195X8PVadgn-Ail3TqS1wuroWR07K5crkuPlcWA4PUNsv-CB0vj8am-G5ww52oFQTsOZlQBBiIWEfY_aMDzwfzRGdn9X9c7sZd2EKL6jFZSP6dWpxig9XwYDeZDdI__kJ76DD_RNbhyhW0iWeSFbkAN120HfSyY.An-2DmyD0xXSJkDMo-t7Fcv5zrZp0si14SzG6IKZDbU&dib_tag=se&keywords=smart+watches&qid=1712596558&sr=8-15",
        ratings: "4.0",
        no_of_ratings: "1169",
        actual_price: "Rs 1299",
      },
      {
        name: "LG 11 Kg 5 Star Wind Jet Dry Rat Away Technology Semi-Automatic Top Loading Washing Machine P1155SKAZ Roller Jet Pulsator Punch   3 Middle Black",
        image: "https://m.media-amazon.com/images/I/81B7XtNFTtL._AC_UY218_.jpg", // Replace with actual image URL
        link: "https://www.amazon.in/LG-Semi-Automatic-Loading-P1155SKAZ-Pulsator/dp/B09FHRY2RF/ref=sr_1_68?dib=eyJ2IjoiMSJ9.LXvIyaF0pHsn4bGniogb1_SebEE96MPoW93dhM5dA31nG8lSaLEJHvjskVMZrtgiE7ZYRBzYCvXIdyb4_IutrR04jqK1OSp2Yu0rRN8yn4b_MyXqEKDcAG8QlWlMhI-Y6xF1-FIpG7QxBQPw7OnRHE5V2Cb614r-rVS3znxVM2WxKxL9kB9k7PdU8UR0Q6Bk5zWST7JEdenRsQsauo-KoP1wHyWvG7MvkoWpD0fDlpQ.SiRC1Pc17907-EvgnW6gAqEHdPaP98qywn_v2N5QsJQ&dib_tag=se&keywords=washing+machine&qid=1712596209&sr=8-68",
        ratings: "4.4",
        no_of_ratings: "1669",
        actual_price: "Rs 19990",
      },
      {
        name: "URBN 20000 mAh 22.5W Super Fast Charging Ultra Compact Power Bank with 25W USB to Type C Cable Length: 5 Feet Quick Charge  Power Delivery Type C Input Output BIS Certified Made in India Camo",
        image: "https://m.media-amazon.com/images/I/71bnK4O7RSL._AC_UY218_.jpg", // Replace with actual image URL
        link: "https://www.amazon.in/URBN-20000-Charging-Compact-Length/dp/B0C7LB27V3/ref=sr_1_150?dib=eyJ2IjoiMSJ9.A86yM_4lGGRPEBi2Zujiyozl2-c7r8yXI0c5sWDvtnAMfKVCnjsnvDLEs82hpevomUgaCgcZm2CibNYxmLw_Tjes2ZRIn0iXmDIbckgMMsohqY16zo88b9SZUdDodOnOuxVtpKUTDvt9Uh7dA8NdzOpv2H0im0tdL52OknDB1r7YAlt2ONTKskgHzujuan0Sc2NpRbzetIzn5hXT6d2Y1kQUHSDKusU5OOx8qAfF1nQ.0A-ly-qEApToLRSXgr6ywPsNp0f6AA9wAdSypyEpYA0&dib_tag=se&keywords=power+banks&qid=1712596484&sr=8-150",
        ratings: "3.9",
        no_of_ratings: "14158",
        actual_price: "Rs 1599",
      },
      {
        name: "Syvo S -1000 PRO 67 Inch 170CM Tripod for DSLR Camera  Operating Height: 5.57 Feet Maximum Load Capacity up to 5kg  Portable Lightweight Aluminum Tripod 360 Degree Ball Head  Carry Bag Black",
        image: "https://m.media-amazon.com/images/I/612lwqNyDWL._AC_UY218_.jpg", // Replace with actual image URL
        link: "https://www.amazon.in/PRO-Tripod-Camera-Operating-Height/dp/B095WFFMB1/ref=sr_1_211?dib=eyJ2IjoiMSJ9.Jz8xYzzpWHjCEFnwCBrnrD4QztEi5qTUQweoqI4dH-CB1Wz2LMHdwVwG7Z1LfxclqvACiqmT8JxphwBIz6rN8he6GM9neivJwCcyBHUnjL0Q58hyjYdfvi3QKvVTJ1wjQ_ClP0gI190-N6RFKUgFfualiZqmEFXfFvx4TmbFhdwmgTsOGu1KlCyVIeYmA4WcQnORb5fbOn_zNA19U0Reii8xXSnT9W5UWaIH7QlnUtk.DzvdXhH_ZGL9xeXh1zQGMNj2EYq6-50L5cvOHNC4MYk&dib_tag=se&keywords=camera&qid=1712595911&sr=8-211",
        ratings: "4.3",
        no_of_ratings: "28982",
        actual_price: "Rs 1499",
      }
    ];
    displaySearchResults(defaultProduct, "Bestseller Products");
  }
  // Display defaults products -- END


  // =================== Price Meter ----------------
  const minPriceInput = document.getElementById("minPriceInput");
  const maxPriceInput = document.getElementById("maxPriceInput");
  const priceSortButton = document.getElementById("priceSortButton");


  priceSortButton.addEventListener("click", function () {
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    const typedword = searchInput.value;
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm.length > 0) {
      searchProductsByPrice(searchTerm, typedword, minPrice, maxPrice);
    } else {
      clearSearchResults();
    }
  });

  function extractNumericPrice(priceString) {
    // Remove non-numeric characters and parse the remaining string as a float
    return parseFloat(priceString.replace(/[^\d.]/g, ''));
  }

  function searchProductsByPrice(keyword, typedword, minPrice, maxPrice) {
    fetch("/static/script/Product_Dataset.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const products = parseCsv(csvData);

        // products.forEach((product) => {
        //   console.log(extractNumericPrice(product.actual_price));
        // });

        const searchResults = products.filter(
          (product) =>
            (product.name.toLowerCase().includes(keyword) ||
              product.categories.toLowerCase().includes(keyword)) &&
              extractNumericPrice(product.actual_price) >= minPrice &&
              extractNumericPrice(product.actual_price) <= maxPrice
        );
        console.log(searchResults);

        displaySearchResults(searchResults, typedword);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  }

  
  // Sending it to CSV File

  submitButton.addEventListener("click", function () {
    const typedword = searchInput.value;
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm.length > 0) {
      searchProducts(searchTerm, typedword);
    } else {
      clearSearchResults();
    }
  });
  
  // Add event listener to user profile div
  userProfileDiv.addEventListener("click", function () {
    window.location.href = "/user_profile";

  });

  // Function to send AJAX request to update_scrape_reviews_csv endpoint
  function updateScrapeReviewsCSV() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/update_scrape_reviews_csv", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Scrape reviews CSV updated successfully!");
      }
    };
    xhr.send();
  }

  function searchProducts(keyword, typedword) {
    fetch("/static/script/Product_Dataset.csv")
      .then((response) => response.text())
      .then((csvData) => {
        const products = parseCsv(csvData);
        const searchResults = products.filter(
          (product) =>
            product.name.toLowerCase().includes(keyword) ||
            product.categories.toLowerCase().includes(keyword)
        );

        // Now construct the search results array with correct keys
        const formattedResults = searchResults.map((product) => {
          return {
            Product_name: product.name,
            Category: product.categories,
            Rating: product.rating,
            No_of_Ratings: product.no_of_ratings,
            Link: product.link,
          };
        });

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/search_results?keyword=" + keyword, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // Handle the response
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            // You can handle the response data here
          }
        };
        xhr.send(JSON.stringify(formattedResults));
        displaySearchResults(searchResults, typedword);
        updateScrapeReviewsCSV();
        // console.log(products);
      })
      .catch((error) => console.error("Error fetching CSV file:", error));
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++

  // ----------------------------------------------------
  // CSV Code

  // ----------------------------------------------------
  // parsing the dataset to readable format
  function parseCsv(csvData) {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim()); // Trim headers
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const productData = lines[i].split(",");
      if (productData.length === headers.length) {
        // Ensure correct number of columns
        const product = {};
        for (let j = 0; j < headers.length; j++) {
          product[headers[j]] = productData[j].trim(); // Trim product data
        }
        products.push(product);
      }
    }

    return products;
  }

  function displaySearchResults(results, typedword) {
    // searchResultsList.innerHTML = "";
    productCardsContainer.innerHTML = "";

    // Display searched keyword
    const keywordListItem = document.createElement("li");
    keywordListItem.textContent = typedword;
    searchResultsList.appendChild(keywordListItem);

    results.slice(0, 100).forEach((product) => {
      const listItem = document.createElement("li");
      listItem.textContent = truncateText(product.name, 8);
      // searchResultsList.appendChild(listItem);

      const card = document.createElement("div");
      card.classList.add("product-card");

      const image = document.createElement("img");
      image.src = product.image; // Assuming product.image contains the URL of the image
      image.alt = product.name; 
      card.appendChild(image);

      const details = document.createElement("div");
      details.classList.add("details");

      details.innerHTML = `
                  <h2><a href="#" class="product-link" data-product-id="${
                    product.name
                  }">${truncateText(product.name, 7)}</a></h2>
                  <p>Direct Link: <a href="${
                    product.link
                  }" target="_blank">${truncateLink(product.link, 80)}</a></p>
                  <p>Rating: ${product.ratings}</p>
                  <p>No. of Ratings: ${product.no_of_ratings}</p>
                  <p>Price: ${product.actual_price}</p>
              `;
      card.appendChild(details);
      productCardsContainer.appendChild(card);
    });

    // Add event listeners to product links
    const productLinks = document.querySelectorAll(".product-link");
    productLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const productId = event.target.getAttribute("data-product-id");
        // Navigate to the product details page with productId
        window.location.href = `/product_expand.html?productId=${productId}`;
      });
    });
  }

  // Function to truncate text to a specified number of words
  function truncateText(text, numWords) {
    if (typeof text !== "string" || text.trim() === "") {
      return ""; // Handle cases where text is not a valid string
    }
    const words = text.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + " ...";
    } else {
      return text;
    }
  }

  // Function to truncate link to a specified number of characters
  function truncateLink(link, numCharacters) {
    if (link.length > numCharacters) {
      const truncatedLink = link.slice(0, numCharacters);
      const lastSlashIndex = truncatedLink.lastIndexOf("/");
      if (lastSlashIndex !== -1) {
        return truncatedLink.slice(0, lastSlashIndex) + "/...";
      }
    }
    return link;
  }

  function clearSearchResults() {
    // searchResultsList.innerHTML = "";
    productCardsContainer.innerHTML = "";
  }
});

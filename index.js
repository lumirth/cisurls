// fix URLs from the UIUC CIS API to work with the UIUC CIS Explorer
function fixDocumentationURL(url, addCascade = false) {
  // Check if the input is a valid string
  if (typeof url !== "string") {
    throw new Error('The "url" parameter must be a string.');
  }

  // Check if the input is an empty string
  if (url.length === 0) {
    throw new Error('The "url" parameter must not be an empty string.');
  }

  // Check if the input is a valid URL
  try {
    new URL(url);
  } catch {
    throw new Error('The "url" parameter must be a valid URL.');
  }

  // Replace http:// with https://
  url = url.replace(/^http:\/\//, "https://");

  // Check that the URL is a UIUC CIS API URL(http[s]://courses.illinois.edu/cisapi/)
  const uiucCisApiPattern = /^https?:\/\/courses\.illinois\.edu\/cisapi\//;
  if (!uiucCisApiPattern.test(url)) {
    throw new Error(
      'The \"url\" parameter must be a UIUC CIS API URL (like http(s)://courses.illinois.edu/cisapi/)."'
    );
  }

  // Special case: if url matches https://courses.illinois.edu/cisapi/schedule/courses?year=2012&term=spring§ionTypeCode=LEC§ionTypeCode=Q&collegeCode=KV&creditHours=3&subject=CHEM&sessionId=1&gened=NAT&qp=atomic+structure
  const specialUrlPattern =
    /^https:\/\/courses\.illinois\.edu\/cisapi\/schedule\/courses\?.*$/;
  if (specialUrlPattern.test(url)) {
    url = url.replace(/§/g, "&sect");
  }

  // Replace "/cisapi" with "/cisapp/explorer"
  url = url.replace("/cisapi", "/cisapp/explorer");

  // Add ".xml" before the parameters if it doesn't already exist
  if (!url.includes(".xml")) {
    const [baseUrl, queryParams] = url.split("?");
    url = queryParams ? `${baseUrl}.xml?${queryParams}` : `${baseUrl}.xml`;
  }

  // Add "mode=cascade" parameter if requested
  if (addCascade) {
    if (url.includes("mode=")) {
      // Replace "mode=*" with "mode=cascade" if it already exists.
      url = url.replace(/mode=[^&]*/, "mode=cascade");
    } else {
      // Add "mode=cascade" with & or ? depending on if there are already parameters.
      url += url.includes("?") ? "&mode=cascade" : "?mode=cascade";
    }
  }

  return url;
}

// convert CISAPI URLs to courses.illinois.edu URLs
// Can't be cascaded because needs to be course URL
async function convertCourseURL(url) {
  const axios = require('axios');

  // Check if the input is a valid string
  if (typeof url !== "string") {
    throw new Error('The "url" parameter must be a string.');
  }

  // Check if the input is an empty string
  if (url.length === 0) {
    throw new Error('The "url" parameter must not be an empty string.');
  }

  // Check if the input is a valid URL
  try {
    new URL(url);
  } catch {
    throw new Error('The "url" parameter must be a valid URL.');
  }

  // Check that the URL is a UIUC CIS Explorer URL(http[s]://courses.illinois.edu/cisapp/explorer/)
  const uiucCisExplorerPattern =
    /^https?:\/\/courses\.illinois\.edu\/cisapp\/explorer\//;
  if (!uiucCisExplorerPattern.test(url)) {
    throw new Error(
      'The \"url\" parameter must be a UIUC CIS API Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
    );
  }

  // Send a request to the URL using axios
  const request = await axios.get(url).catch((error) => {
    // catch 404 and print accordingly
    if (error.response.status === 404) {
      throw new Error(
        'URL returned a 404. The "url" parameter must be a UIUC CIS Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
      );
    }
  });

  // Make sure the response contains the <sections> tag
  if (!request.data.includes("<sections>")) {
    throw new Error(
      'Didn\'t find "<sections>" tag inside the response. The "url" parameter must be a UIUC CIS Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
    );
  }

  url = url.replace("/cisapp/explorer", "/search");
  url = url.replace(".xml", "");

  return url;
}

// Export the modifyUrl function as a module
module.exports = { fixDocumentationURL, convertCourseURL };

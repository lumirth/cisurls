# UIUC CIS API URL Tools

[![npm version](https://img.shields.io/npm/v/uiuc-cis-urls)](https://www.npmjs.com/package/uiuc-cisapi-urls) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/npm/dt/uiuc-cisapi-urls.svg)](https://www.npmjs.com/package/uiuc-cisapi-urls)

Some very basic UIUC Course Information Suite(CIS) API URL utilities. Fix URLs from the documentation(from `cisapi` to `cisapp/explorer`) to make them plug-and-play, take API URL(`cisapp/explorer`) and make it courses.illinois.edu web page URL, and maybe more in the future.

## Functions

### fixDocumentationURL(url, addCascade = false)

This function takes a URL from the UIUC CIS API and modifies it to work with the UIUC CIS Explorer. It performs a series of string manipulations to ensure that the URL conforms to the required format.

#### Parameters

- `url` (string): The original URL from the UIUC CIS API that needs to be fixed.
- `addCascade` (boolean, optional): A flag indicating whether to add the "mode=cascade" parameter to the URL. Defaults to `false`.

#### Returns

- (string): The fixed URL that is compatible with the UIUC CIS Explorer.

#### Throws

- Error: If the input URL is not a valid string, is empty, is not a valid URL, or does not match the expected pattern for a UIUC CIS API URL.

### convertCourseURL(url)

This asynchronous function takes a URL from the UIUC CIS Explorer and converts it to a URL that points to the course search page on courses.illinois.edu. It performs validation checks and sends an HTTP GET request to the input URL to ensure its validity before performing the conversion.

#### Parameters

- `url` (string): The original URL from the UIUC CIS Explorer that needs to be converted.

#### Returns

- (Promise<string>): A promise that resolves to the converted URL that points to the course search page on courses.illinois.edu.

#### Throws

- Error: If the input URL is not a valid string, is empty, is not a valid URL, does not match the expected pattern for a UIUC CIS Explorer URL, returns a 404 status code, or does not contain the `<sections>` tag in the response.

## Usage

```javascript
const { fixDocumentationURL, convertCourseURL } = require("./path/to/module");

// Example usage of fixDocumentationURL
const fixedUrl = fixDocumentationURL(
  "http://courses.illinois.edu/cisapi/schedule/courses?year=2012&term=spring§ionTypeCode=LEC§ionTypeCode=Q&collegeCode=KV&creditHours=3&subject=CHEM&sessionId=1&gened=NAT&qp=atomic+structure",
  true
);
console.log(fixedUrl);

// Example usage of convertCourseURL
convertCourseURL(
  "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml"
)
  .then((convertedUrl) => {
    console.log(convertedUrl);
  })
  .catch((error) => {
    console.error(error.message);
  });
```

## Dependencies

This module requires the `axios` library for making HTTP requests.

## Testing

This module uses `jest` for testing. To run the tests, use the following command:

```bash
npm test
```

## Keywords

- uiuc
- illinois
- illini
- cisapi
- cisapp

## Author

lumirth:

- [GitHub](https://github.com/lumirth)
- [Site](https://mirth.cc)

## License

This module is licensed under the MIT License.

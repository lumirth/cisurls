# UIUC CIS API URL Tools

[![npm version](https://img.shields.io/npm/v/cisurls)](https://www.npmjs.com/package/uiuc-cisapi-urls) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/npm/dt/uiuc-cisapi-urls.svg)](https://www.npmjs.com/package/uiuc-cisapi-urls)

Some very basic UIUC Course Information Suite(CIS) API URL utilities. Fix URLs from the [documentation](https://courses.illinois.edu/cisdocs/api)(from `cisapi` to `cisapp/explorer`) to make them plug-and-play, take API URL(`cisapp/explorer`) and make it courses.illinois.edu web page URL, and maybe more in the future.

A web interface for this module is available at [mirth.cc/cisurls-web](https://mirth.cc/cisurls-web).

## Installation

Install via npm:

`````````
npm install uiuc-cis-url-utils
`````````

## Usage

`````````javascript
const { fixDocumentationURL, convertCourseURL } = require("uiuc-cis-url-utils");
// Fix a URL from the UIUC CIS API documentation
const fixedUrl = fixDocumentationURL(
  "http://courses.illinois.edu/cisapi/schedule/courses?year=2012&term=spring§ionTypeCode=LEC§ionTypeCode=Q&collegeCode=KV&creditHours=3&subject=CHEM&sessionId=1&gened=NAT&qp=atomic+structure"
);
console.log(fixedUrl);
// Convert a UIUC CIS API Course URL to a courses.illinois.edu URL
const courseUrl = convertCourseURL(
  "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml"
);
console.log(courseUrl);
`````````

## API

### fixDocumentationURL(url, addCascade = false)

Fixes a URL from the UIUC CIS API documentation to work with the UIUC CIS Explorer.

Fixes the following:
- Change “/cisapi” to “/cisapp/explorer”
- Add .xml before the parameters. For example, change “/courses” to “/courses.xml”
- Special case of missing `&` before `§` in schedule/courses endpoint.

Parameters:
- `url` (string): The URL to be fixed.
- `addCascade` (boolean, optional): If `true`, adds the "mode=cascade" parameter to the URL. Default is `false`.

### convertCourseURL(url)

Converts a UIUC CIS API course URL to a `courses.illinois.edu` web page URL. (Beginning with http[s]://courses.illinois.edu/cisapp/explorer/schedule)

Does the following:
- Change "/cisapp/explorer" to "/search"
- Remove ".xml" from the end of the URL
- Remove query parameters

Parameters:
- `url` (string): The URL to be converted.

### Throws
Here's an explanation of when these errors can be thrown:

1.  `fixDocumentationURL(url, addCascade)` and `convertCourseURL(url)` functions:
    
    *   Both functions will throw an error if the provided `url` parameter is not a string:
        
        ```The "url" parameter must be a string.```

    *   Both functions will also throw an error if the provided `url` parameter is an empty string:
        
        ```The "url" parameter must not be an empty string.```

    *   Both functions will throw an error if the provided `url` parameter is not a valid URL:  

        ```The "url" parameter must be a valid URL.```

2.  `fixDocumentationURL(url, addCascade)` function:

    *   If the provided `url` is not a UIUC CIS API URL:

        ```The "url" parameter must be a UIUC CIS API URL (like http(s)://courses.illinois.edu/cisapi/).```

4.  `convertCourseURL(url)` function:

    *   If the provided `url` is not a UIUC CIS Explorer URL:

        ```The "url" parameter must be a UIUC CIS API Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).```
    *   If the provided `url` does not match the pattern of a valid course URL on the UIUC CIS Explorer:

        ```The "url" parameter must be a UIUC CIS API Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).```


In all these cases, the errors are thrown to ensure that the provided input meets the required format and structure. If any of these conditions are not met, the functions cannot guarantee the correct processing and conversion of the input URL.

## Tests

Run tests with Jest:

`````````bash
npm test
`````````

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

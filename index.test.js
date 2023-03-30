const { fixDocumentationURL, convertCourseURL } = require("./index");
const axios = require("axios");

jest.mock("axios");

describe("fixDocumentationURL", () => {
  test("should fix a valid URL", () => {
    const url =
      "http://courses.illinois.edu/cisapi/schedule/courses?year=2012&term=spring§ionTypeCode=LEC§ionTypeCode=Q&collegeCode=KV&creditHours=3&subject=CHEM&sessionId=1&gened=NAT&qp=atomic+structure";
    const result = fixDocumentationURL(url, true);
    expect(result).toBe(
      "https://courses.illinois.edu/cisapp/explorer/schedule/courses.xml?year=2012&term=spring&sectionTypeCode=LEC&sectionTypeCode=Q&collegeCode=KV&creditHours=3&subject=CHEM&sessionId=1&gened=NAT&qp=atomic+structure&mode=cascade"
    );
  });

  test("should throw an error if url is not a string", () => {
    expect(() => fixDocumentationURL(123)).toThrow(
      'The "url" parameter must be a string.'
    );
  });

  test("should throw an error if url is an empty string", () => {
    expect(() => fixDocumentationURL("")).toThrow(
      'The "url" parameter must not be an empty string.'
    );
  });

  test("should throw an error if url is not a valid URL", () => {
    expect(() => fixDocumentationURL("invalid-url")).toThrow(
      'The "url" parameter must be a valid URL.'
    );
  });

  test("should throw an error if url is not a UIUC CIS API URL", () => {
    expect(() => fixDocumentationURL("https://example.com/cisapi/")).toThrow(
      'The "url" parameter must be a UIUC CIS API URL (like http(s)://courses.illinois.edu/cisapi/)."'
    );
  });
});

describe("convertCourseURL", () => {
  test("throws an error if url parameter is not a string", () => {
    expect(() => {
      convertCourseURL(null);
    }).toThrow("The \"url\" parameter must be a string.");
  });

  test("throws an error if url parameter is an empty string", () => {
    expect(() => {
      convertCourseURL("");
    }).toThrow("The \"url\" parameter must not be an empty string.");
  });

  test("throws an error if url parameter is not a valid URL", () => {
    expect(() => {
      convertCourseURL("not_a_valid_url");
    }).toThrow("The \"url\" parameter must be a valid URL.");
  });

  test("throws an error if url parameter is not a UIUC CIS Explorer URL", () => {
    expect(() => {
      convertCourseURL("https://example.com");
    }).toThrow(
      'The "url" parameter must be a UIUC CIS API Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
    );
  });

  test("throws an error if the URL is not a valid course URL", () => {
    // mock XMLHttpRequest to return a non-200 response status
    const mockXMLHttpRequest = jest.fn();
    mockXMLHttpRequest.mockReturnValue({
      status: 404,
      send: jest.fn(),
      open: jest.fn(),
    });
    global.XMLHttpRequest = jest.fn().mockImplementation(() => {
      return mockXMLHttpRequest();
    });

    expect(() => {
      convertCourseURL(
        "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml"
      );
    }).toThrow(
      'The "url" parameter must be a UIUC CIS API Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
    );
  });

  test("returns the converted URL if input is a valid UIUC CIS Explorer URL", () => {
    // mock XMLHttpRequest to return a 200 response status
    const mockXMLHttpRequest = jest.fn();
    mockXMLHttpRequest.mockReturnValue({
      status: 200,
      send: jest.fn(),
      open: jest.fn(),
    });
    global.XMLHttpRequest = jest.fn().mockImplementation(() => {
      return mockXMLHttpRequest();
    });

    const input = "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml";
    const expectedOutput = "https://courses.illinois.edu/search/schedule/2012/spring/AAS/120";

    expect(convertCourseURL(input)).toBe(expectedOutput);
  });

  test("returns the converted URL if input is a valid UIUC CIS Explorer URL with a mode query", () => {
    // mock XMLHttpRequest to return a 200 response status
    const mockXMLHttpRequest = jest.fn();
    mockXMLHttpRequest.mockReturnValue({
      status: 200,
      send: jest.fn(),
      open: jest.fn(),
    });
    global.XMLHttpRequest = jest.fn().mockImplementation(() => {
      return mockXMLHttpRequest();
    });

    const input = "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml?mode=summary";
    const expectedOutput = "https://courses.illinois.edu/search/schedule/2012/spring/AAS/120";

    expect(convertCourseURL(input)).toBe(expectedOutput);
  });
});

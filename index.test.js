const { fixDocumentationURL, convertCourseURL } = require("./index");

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

  test ("should throw an error if url is not a UIUC CIS API schedule endpoint", () => {
    expect(() => fixDocumentationURL("https://courses.illinois.edu/cisapi/")).toThrow(
      'The "url" parameter must use the schedule endpoint (like http(s)://courses.illinois.edu/cisapi/schedule/)."'
    );
  });
});

describe('convertCourseURL', () => {
  test('should convert a valid CISAPI URL to courses.illinois.edu URL', () => {
    const inputUrl = 'https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml';
    const expectedUrl = 'https://courses.illinois.edu/search/schedule/2012/spring/AAS/120';
    expect(convertCourseURL(inputUrl)).toBe(expectedUrl);
  });

  test('should throw an error if the input is not a string', () => {
    const inputUrl = 12345;
    expect(() => convertCourseURL(inputUrl)).toThrow('The "url" parameter must be a string.');
  });

  test('should throw an error if the input is an empty string', () => {
    const inputUrl = '';
    expect(() => convertCourseURL(inputUrl)).toThrow('The "url" parameter must not be an empty string.');
  });

  test('should throw an error if the input is not a valid URL', () => {
    const inputUrl = 'invalid-url';
    expect(() => convertCourseURL(inputUrl)).toThrow('The "url" parameter must be a valid URL.');
  });

  test('should throw an error if the input is not a UIUC CIS API Explorer course URL', () => {
    const inputUrl = 'https://example.com/cisapp/explorer/schedule/2012/spring/AAS/120.xml';
    expect(() => convertCourseURL(inputUrl)).toThrow('The "url" parameter must be a UIUC CIS API Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).');
  });

  test('should throw an error if the input URL does not match the expected pattern', () => {
    const inputUrl = 'https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/invalid.xml';
    expect(() => convertCourseURL(inputUrl)).toThrow('The "url" parameter must be a UIUC CIS API Explorer course URL (like /:year/:term/:department/:course.xml).');
  });

  test('should handle http URLs and convert them to https', () => {
    const inputUrl = 'http://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml';
    const expectedUrl = 'https://courses.illinois.edu/search/schedule/2012/spring/AAS/120';
    expect(convertCourseURL(inputUrl)).toBe(expectedUrl);
  });
});


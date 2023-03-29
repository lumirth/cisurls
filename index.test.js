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
  test("should convert a valid URL", async () => {
    const url =
      "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml";
    axios.get.mockResolvedValue({ data: "<sections></sections>" });
    const result = await convertCourseURL(url);
    expect(result).toBe(
      "https://courses.illinois.edu/search/schedule/2012/spring/AAS/120"
    );
  });

  test("should throw an error if url is not a string", async () => {
    await expect(convertCourseURL(123)).rejects.toThrow(
      'The "url" parameter must be a string.'
    );
  });

  test("should throw an error if url is an empty string", async () => {
    await expect(convertCourseURL("")).rejects.toThrow(
      'The "url" parameter must not be an empty string.'
    );
  });

  test("should throw an error if url is not a valid URL", async () => {
    await expect(convertCourseURL("invalid-url")).rejects.toThrow(
      'The "url" parameter must be a valid URL.'
    );
  });

  test("should throw an error if url is not a UIUC CIS Explorer URL", async () => {
    await expect(
      convertCourseURL("https://example.com/cisapp/explorer/")
    ).rejects.toThrow(
      'The "url" parameter must be a UIUC CIS API Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
    );
  });

  test("should throw an error if URL returns a 404", async () => {
    const url =
      "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml";
    axios.get.mockRejectedValue({ response: { status: 404 } });
    await expect(convertCourseURL(url)).rejects.toThrow(
      'URL returned a 404. The "url" parameter must be a UIUC CIS Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
    );
  });

  test('should throw an error if response does not contain "<sections>" tag', async () => {
    const url =
      "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml";
    axios.get.mockResolvedValue({ data: "<invalid></invalid>" });
    await expect(convertCourseURL(url)).rejects.toThrow(
      'Didn\'t find "<sections>" tag inside the response. The "url" parameter must be a UIUC CIS Explorer course URL (like https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml).'
    );
  });

  test("should throw an error if converted URL returns a 404", async () => {
    const url =
      "https://courses.illinois.edu/cisapp/explorer/schedule/2012/spring/AAS/120.xml";
    axios.get.mockResolvedValueOnce({ data: "<sections></sections>" });
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });
    await expect(convertCourseURL(url)).rejects.toThrow(
      'URL returned a 404. The "url" did not convert to a valid course.illinois.edu page.'
    );
  });
});

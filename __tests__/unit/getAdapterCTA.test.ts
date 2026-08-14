import { getAdapterCTA, IAdapterCTAObj, localeSegmentRemoval } from "@/lib/utilities";

describe("getAdapterCTA test", () => {
  const mockdata: IAdapterCTAObj = {
    callToActionHash: "hash",
    callToActionText: "Click me!",
    target: {
      id: "1234",
      teaserText: "teaserText",
      title: "title",
      type: "type",
      url: "",
      navigationPath: [
        { segment: "em-it" },
        { segment: "our-solution" },
      ],
    },
  };

  it("return format in ICta array", () => {
    const result = getAdapterCTA([mockdata]);
    
    // Label
    expect(result[0].label).toEqual(mockdata.callToActionText);
    
    // Url
    const joinedSegment = localeSegmentRemoval(mockdata.target?.navigationPath?.map((segment) => segment.segment).join("/"));
    const mockHash = mockdata.callToActionHash ? `#${mockdata.callToActionHash}` : "";
    expect(result[0].url).toEqual(joinedSegment + mockHash);
    
    // CM additional segment removed
    const hasEM = result[0].url.includes(process.env.NEXT_PUBLIC_CM_SEGMENT as string);
    expect(!hasEM).toBeTruthy();
  });
  
  it("return URL without hash", () => {
    const result = getAdapterCTA([{ ...mockdata, callToActionHash: "" }]);
    expect(!result[0].url.includes("#")).toBeTruthy();
  });
  
  it("return external url", () => {
    const result = getAdapterCTA([{ ...mockdata, target: { ...mockdata.target, type: "CMExternalLink" } }]);
    expect(!!result[0].isExternal).toBeTruthy();
  });
  
  it("return is download link", () => {
    const result = getAdapterCTA([{ ...mockdata, target: { ...mockdata.target, type: "CMDownload" } }]);
    expect(result[0].url).toEqual(`/cap/content/${mockdata.target?.id}/`);
    expect(result[0].isFileDownload).toBeTruthy();
  });
});

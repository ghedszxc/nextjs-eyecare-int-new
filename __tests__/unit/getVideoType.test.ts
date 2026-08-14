import { getVideoType } from "@/lib/utilities";

describe("getVideoType test", () => {
  it("getVideoType returns youtube", () => {
    const videoType = getVideoType("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(videoType).toEqual("youtube");
  });

  it("getVideoType returns vimeo", () => {
    const videoType = getVideoType("https://vimeo.com/675792981");
    expect(videoType).toEqual("vimeo");
  });

  it("getVideoType returns mp4", () => {
    const videoType = getVideoType("http://preview-stageessilorluxottica.luxgroup.net/caas/v1/media/177134/data/video/5e7b2359576adb73ad690fbc969200d9.mp4");
    expect(videoType).toEqual("mp4");
  });
  
  it("getVideoType returns unknown", () => {
    const videoType = getVideoType("https://google.com");
    expect(videoType).toEqual("unknown");
  });
});

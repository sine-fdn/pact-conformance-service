import { normalizeUrl, joinUrl, normalizeBaseUrl } from "./urlUtils";

describe("urlUtils", () => {
  describe("normalizeUrl", () => {
    it("should preserve protocol double slashes", () => {
      expect(normalizeUrl("https://api.com/v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should remove consecutive slashes except after protocol", () => {
      expect(normalizeUrl("https://api.com//v2//footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should handle multiple parts with trailing/leading slashes", () => {
      expect(normalizeUrl("https://api.com/", "/v2/", "/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should filter out undefined parts", () => {
      expect(normalizeUrl("https://api.com", undefined, "/v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should filter out empty string parts", () => {
      expect(normalizeUrl("https://api.com", "", "/v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should handle well-known paths", () => {
      expect(normalizeUrl("https://api.com", "/.well-known/openid-configuration")).toBe(
        "https://api.com/.well-known/openid-configuration"
      );
    });
  });

  describe("joinUrl", () => {
    it("should join base URL and path with no slashes", () => {
      expect(joinUrl("https://api.com", "v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should join base URL with trailing slash and path with leading slash", () => {
      expect(joinUrl("https://api.com/", "/v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should join base URL with trailing slash and path without leading slash", () => {
      expect(joinUrl("https://api.com/", "v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should join base URL without trailing slash and path with leading slash", () => {
      expect(joinUrl("https://api.com", "/v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should handle multiple trailing/leading slashes", () => {
      expect(joinUrl("https://api.com///", "///v2/footprints")).toBe(
        "https://api.com/v2/footprints"
      );
    });

    it("should handle base URL without path parameter", () => {
      expect(joinUrl("https://api.com/")).toBe("https://api.com");
    });

    it("should handle well-known paths", () => {
      expect(joinUrl("https://api.com", "/.well-known/openid-configuration")).toBe(
        "https://api.com/.well-known/openid-configuration"
      );
    });

    it("should handle auth token paths", () => {
      expect(joinUrl("https://api.com", "/auth/token")).toBe(
        "https://api.com/auth/token"
      );
      expect(joinUrl("https://api.com/", "/auth/token")).toBe(
        "https://api.com/auth/token"
      );
    });

    it("should handle versioned API paths", () => {
      expect(joinUrl("https://api.com", "/2/footprints")).toBe(
        "https://api.com/2/footprints"
      );
      expect(joinUrl("https://api.com/", "/3/events")).toBe(
        "https://api.com/3/events"
      );
    });

    it("should handle paths with IDs", () => {
      const footprintId = "123e4567-e89b-12d3-a456-426614174000";
      expect(joinUrl("https://api.com", `/2/footprints/${footprintId}`)).toBe(
        `https://api.com/2/footprints/${footprintId}`
      );
    });

    it("should handle query parameters", () => {
      expect(joinUrl("https://api.com", "/2/footprints?limit=1")).toBe(
        "https://api.com/2/footprints?limit=1"
      );
    });
  });

  describe("normalizeBaseUrl", () => {
    it("should remove trailing slashes", () => {
      expect(normalizeBaseUrl("https://api.com/")).toBe("https://api.com");
      expect(normalizeBaseUrl("https://api.com///")).toBe("https://api.com");
    });

    it("should handle URL without trailing slashes", () => {
      expect(normalizeBaseUrl("https://api.com")).toBe("https://api.com");
    });

    it("should remove consecutive slashes", () => {
      expect(normalizeBaseUrl("https://api.com//path")).toBe(
        "https://api.com/path"
      );
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle auth URL construction from test cases", () => {
      const authBaseUrl = "https://auth.example.com/";
      expect(joinUrl(authBaseUrl, "/auth/token")).toBe(
        "https://auth.example.com/auth/token"
      );
    });

    it("should handle footprints URL construction", () => {
      const baseUrl = "https://api.example.com/";
      const apiVersion = "2";
      expect(joinUrl(baseUrl, `/${apiVersion}/footprints`)).toBe(
        "https://api.example.com/2/footprints"
      );
    });

    it("should handle HTTP protocol replacement", () => {
      const baseUrl = "https://api.example.com/";
      expect(joinUrl(baseUrl.replace("https", "http"), "/2/footprints")).toBe(
        "http://api.example.com/2/footprints"
      );
    });

    it("should handle callback URL construction", () => {
      const webhookUrl = "https://webhook.example.com/callback/";
      const callbackBaseUrl = webhookUrl.replace(/\/+$/, "");
      expect(joinUrl(callbackBaseUrl, "/3/events")).toBe(
        "https://webhook.example.com/callback/3/events"
      );
    });
  });
});

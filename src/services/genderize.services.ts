import logger from "../utils/logger";
import ApiError, {
  BadGatewayError,
  BadRequestError,
} from "../utils/api.errors";

type GenderizeResponse = {
  name: string;
  count: number;
  gender: string | null;
  probability: number;
};

export type ClassifiedGenderResult = {
  name: string;
  gender: string | null;
  probability: number;
  sample_size: number;
  is_confident: boolean;
  processed_at: string;
};

class GenderizeService {
  private readonly baseUrl = "https://api.genderize.io";

  async classify(name: string): Promise<ClassifiedGenderResult> {
    const normalizedName = name.trim();
    if (!normalizedName) {
      throw new BadRequestError("Name is required");
    }

    try {
      const url = `${this.baseUrl}?name=${encodeURIComponent(normalizedName)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new BadGatewayError("Upstream or server failure");
      }

      const data = (await response.json()) as Partial<GenderizeResponse>;

      if (
        typeof data.name !== "string" ||
        typeof data.count !== "number" ||
        typeof data.probability !== "number" ||
        (typeof data.gender !== "string" && data.gender !== null)
      ) {
        throw new BadGatewayError("Upstream or server failure");
      }

      if (data.count === 0 || data.gender === null) {
        throw new BadGatewayError(
          "No prediction available for the provided name",
        );
      }

      const is_confident = data.probability >= 0.7 && data.count >= 100;
      const processed_at = new Date().toISOString();

      const transform: ClassifiedGenderResult = {
        name: data.name,
        gender: data.gender,
        probability: data.probability,
        sample_size: data.count,
        is_confident: is_confident,
        processed_at: processed_at,
      };

      return transform;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      logger.error(
        { err: error, name: normalizedName },
        "Failed to classify gender",
      );
      throw new BadGatewayError("Upstream or server failure");
    }
  }
}

export const genderizeService = new GenderizeService();

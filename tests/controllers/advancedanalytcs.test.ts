import { Request, Response } from "express";
import { AdvancedAnalyticsController } from "../../src/controllers/advancedanalytics.controller";
import { AdvancedAnalyticsServer } from "../../src/services/advancedanalytics.server";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";



const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockRequest = (): Request => ({} as any as Request);

describe("AdvancedAnalyticsController", () => {
  let controller: AdvancedAnalyticsController;
  let analyticsService: jest.Mocked<AdvancedAnalyticsServer>;

  beforeEach(() => {
    analyticsService = {
      getAverageOrderValue: jest.fn(),
      getPriceRangeDistribution: jest.fn()
    } as any;

    controller = new AdvancedAnalyticsController(analyticsService);
    jest.clearAllMocks();
  });



  it("getAverageOrderValue: should return 200 and AverageOrderValue", async () => {
    const req = mockRequest();
    const res = mockResponse();

    analyticsService.getAverageOrderValue.mockResolvedValue(123.45);

    await controller.getAverageOrderValue(req, res);

    expect(analyticsService.getAverageOrderValue).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    // key name matches controller: { AverageOrderValue }
    expect(res.json).toHaveBeenCalledWith({ AverageOrderValue: 123.45 });
  });
   it("getAverageOrderValue: should propagate error when service throws", async () => {
    const req = mockRequest();
    const res = mockResponse();

    analyticsService.getAverageOrderValue.mockRejectedValue(
      new BadRequestException("Invalid data")
    );

    await expect(
      controller.getAverageOrderValue(req, res)
    ).rejects.toBeInstanceOf(BadRequestException);

    // controller must NOT send a response on error
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });


  it("getPriceRangeDistribution: should return 200 and service result", async () => {
    const req = mockRequest();
    const res = mockResponse();

    const distribution = {
      priceRanges: [
        { range: "$0-50", count: 10, percentage: 40 },
        { range: "$51-100", count: 15, percentage: 60 }
      ]
    };

    analyticsService.getPriceRangeDistribution.mockResolvedValue(distribution);

    await controller.getPriceRangeDistribution(req, res);

    expect(analyticsService.getPriceRangeDistribution).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  
    expect(res.json).toHaveBeenCalledWith(distribution);
  });
   it("getPriceRangeDistribution: should propagate error when service throws", async () => {
    const req = mockRequest();
    const res = mockResponse();

    analyticsService.getPriceRangeDistribution.mockRejectedValue(
      new Error("Something went wrong")
    );

    await expect(
      controller.getPriceRangeDistribution(req, res)
    ).rejects.toBeInstanceOf(Error);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

import { Request, Response } from "express";
import { RevenueController } from "../../src/controllers/OrderControllers/revenue.controller";
import { RevenueAnalyticsService } from "../../src/services/OrderManagement/revenueanalytics.server";
import { ItemCategory } from "../../src/model/IItem"; 
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";

const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockRequest = (): Request => ({} as any as Request);

describe("RevenueController", () => {
  let controller: RevenueController;
  let revenueService: jest.Mocked<RevenueAnalyticsService>;

  beforeEach(() => {
    revenueService = {
      getTotalRevenue: jest.fn(),
      getRevenueByCategory: jest.fn()
    } as any;

    controller = new RevenueController(revenueService);
    jest.clearAllMocks();
  });

  it("getTotalRevenue: should return 200 and totalRevenue", async () => {
    const req = mockRequest();
    const res = mockResponse();

    revenueService.getTotalRevenue.mockResolvedValue(123.45);

    await controller.getTotalRevenue(req, res);

    expect(revenueService.getTotalRevenue).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ totalRevenue: 123.45 });
  });
  it("getTotalRevenue: should propagate error when service throws", async () => {
    const req = mockRequest();
    const res = mockResponse();

    revenueService.getTotalRevenue.mockRejectedValue(
      new BadRequestException("Invalid data")
    );

    await expect(controller.getTotalRevenue(req, res)).rejects.toBeInstanceOf(
      BadRequestException
    );

    // controller should not send a response when service fails
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("getRevenueByCategory: should return 200 and flattened object", async () => {
    const req = mockRequest();
    const res = mockResponse();

    const map = new Map<ItemCategory, number>([
      [ItemCategory.Cake, 100],
      [ItemCategory.Book, 50]
    ]);

    revenueService.getRevenueByCategory.mockResolvedValue(map);

    await controller.getRevenueByCategory(req, res);

    expect(revenueService.getRevenueByCategory).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      [ItemCategory.Cake]: 100,
      [ItemCategory.Book]: 50
    });

   
  });
     it("getRevenueByCategory: should propagate error when service throws", async () => {
    const req = mockRequest();
    const res = mockResponse();

    revenueService.getRevenueByCategory.mockRejectedValue(
      new Error("Something went wrong")
    );

    await expect(
      controller.getRevenueByCategory(req, res)
    ).rejects.toBeInstanceOf(Error);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});



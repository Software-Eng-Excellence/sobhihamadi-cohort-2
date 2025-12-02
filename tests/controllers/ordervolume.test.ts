import { Request, Response } from "express";
import { OrderVolumeController } from "../../src/controllers/OrderControllers/ordervolume.controller";
import { OrderVolumeAnalyticsService } from "../../src/services/OrderManagement/OrderVolumeAnalytics.server";
import { ItemCategory } from "../../src/model/IItem";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";



const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockRequest = (): Request => ({} as any as Request);

describe("OrderVolumeController", () => {
  let controller: OrderVolumeController;
  let volumeService: jest.Mocked<OrderVolumeAnalyticsService>;

  beforeEach(() => {
    volumeService = {
      getTotalOrders: jest.fn(),
      getOrderCountsByCategory: jest.fn()
    } as any;

    controller = new OrderVolumeController(volumeService);
    jest.clearAllMocks();
  });

 

  it("gettotalOrder: should return 200 and Orderslength", async () => {
    const req = mockRequest();
    const res = mockResponse();

    volumeService.getTotalOrders.mockResolvedValue(7);

    await controller.gettotalOrder(req, res);

    expect(volumeService.getTotalOrders).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    // note: key name matches your controller exactly: { Orderslength }
    expect(res.json).toHaveBeenCalledWith({ Orderslength: 7 });
  });
  it("gettotalOrder: should propagate error when service throws", async () => {
    const req = mockRequest();
    const res = mockResponse();

    volumeService.getTotalOrders.mockRejectedValue(
      new BadRequestException("Invalid data")
    );

    await expect(controller.gettotalOrder(req, res)).rejects.toBeInstanceOf(
      BadRequestException
    );

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });


  it("getOrderCountsByCategory: should flatten Map and return 200", async () => {
    const req = mockRequest();
    const res = mockResponse();

    const countsMap = new Map<ItemCategory, number>([
      [ItemCategory.Cake, 5],
      [ItemCategory.Book, 3]
    ]);

    volumeService.getOrderCountsByCategory.mockResolvedValue(countsMap);

    await controller.getOrderCountsByCategory(req, res);

    expect(volumeService.getOrderCountsByCategory).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      [ItemCategory.Cake]: 5,
      [ItemCategory.Book]: 3
    });
  });
    it("getOrderCountsByCategory: should propagate error when service throws", async () => {
    const req = mockRequest();
    const res = mockResponse();

    volumeService.getOrderCountsByCategory.mockRejectedValue(
      new Error("Something went wrong")
    );

    await expect(
      controller.getOrderCountsByCategory(req, res)
    ).rejects.toBeInstanceOf(Error);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

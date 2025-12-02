import { Request, Response } from "express";
import { OrderController } from "../../src/controllers/OrderControllers/order.controller";
import { OrderManagementService } from "../../src/services/OrderManagement/ordermanagement.server";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";
import { JsonRequestFactory } from "../../src/mappers";



const mockResponse = (): Response => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockRequest = (body: any = {}, params: any = {}): Request =>
  ({ body, params } as any as Request);

jest.mock("../../src/mappers", () => ({
  JsonRequestFactory: {
    Create: jest.fn()
  }
}));

describe("OrderController ", () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderManagementService>;

  beforeEach(() => {
    orderService = {
      createOrder: jest.fn(),
      getOrderById: jest.fn(),
      listOrders: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn()
    } as any;

    controller = new OrderController(orderService);
    jest.clearAllMocks();
  });



  it("createOrder: 201 + body on success", async () => {
    const fakeOrder: any = { id: "order-1" };

    (JsonRequestFactory.Create as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(fakeOrder)
    });

    orderService.createOrder.mockResolvedValue(fakeOrder);

    const req = mockRequest({ category: "Cake" });
    const res = mockResponse();

    await controller.createOrder(req, res);

    expect(JsonRequestFactory.Create).toHaveBeenCalledWith("Cake");
    expect(orderService.createOrder).toHaveBeenCalledWith(fakeOrder);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeOrder);
  });

  it("createOrder: throws BadRequest when mapping fails", async () => {
    (JsonRequestFactory.Create as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(undefined)
    });

    const req = mockRequest({ category: "Cake" });
    const res = mockResponse();

    await expect(controller.createOrder(req, res)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

 

  it("getOrder: throws BadRequest when id missing", async () => {
    const req = mockRequest({}, {}); // no params.id
    const res = mockResponse();

    await expect(controller.getOrder(req, res)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("getOrder: 200 + order on success", async () => {
    const fakeOrder: any = { id: "order-1" };
    orderService.getOrderById.mockResolvedValue(fakeOrder);

    const req = mockRequest({}, { id: "order-1" });
    const res = mockResponse();

    await controller.getOrder(req, res);

    expect(orderService.getOrderById).toHaveBeenCalledWith("order-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeOrder);
  });

 

  it("updateOrder: throws BadRequest when ids mismatch", async () => {
    const fakeOrder: any = { getid: () => "other-id" };

    (JsonRequestFactory.Create as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(fakeOrder)
    });

    const req = mockRequest({ category: "Cake" }, { id: "order-1" });
    const res = mockResponse();

    await expect(controller.updateOrder(req, res)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  it("updateOrder: 200 + message on success", async () => {
    const fakeOrder: any = { getid: () => "order-1" };

    (JsonRequestFactory.Create as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(fakeOrder)
    });

    orderService.updateOrder.mockResolvedValue();

    const req = mockRequest({ category: "Cake" }, { id: "order-1" });
    const res = mockResponse();

    await controller.updateOrder(req, res);

    expect(orderService.updateOrder).toHaveBeenCalledWith(fakeOrder);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order updated successfully"
    });
  });



  it("deleteOrder: 200 + message on success", async () => {
    orderService.deleteOrder.mockResolvedValue();

    const req = mockRequest({}, { id: "order-1" });
    const res = mockResponse();

    await controller.deleteOrder(req, res);

    expect(orderService.deleteOrder).toHaveBeenCalledWith("order-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order deleted successfully"
    });
  });
});

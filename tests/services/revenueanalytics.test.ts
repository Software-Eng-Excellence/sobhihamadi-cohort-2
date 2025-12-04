import { ItemCategory } from "../../src/model/IItem";
import { OrderManagementService } from "../../src/services/OrderManagement/ordermanagement.server";
import { RevenueAnalyticsService } from "../../src/services/OrderManagement/revenueanalytics.server";


jest.mock('../../src/services/OrderManagement/ordermanagement.server.ts');
    let revenueAnalyticsServer: RevenueAnalyticsService;
    let ordermanagementServerMock: jest.Mocked<OrderManagementService>;
describe('REvenue ANALYTICS SERVER tests', () => {

    beforeEach(() => {
        ordermanagementServerMock = new OrderManagementService() as jest.Mocked<OrderManagementService>;
        revenueAnalyticsServer = new RevenueAnalyticsService(ordermanagementServerMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('getTotalRevenue: should return the total revenue from all orders', async () => {
  const mockOrders = [
    {
      getItem: () => ({ getCategory: () => ItemCategory.Cake }),
      getPrice: () => 100,
      getQuantity: () => 2,
      getid: () => 'order-1',
    },
    {
      getItem: () => ({ getCategory: () => ItemCategory.Book }),
      getPrice: () => 50,
      getQuantity: () => 3,
      getid: () => 'order-2',
    },
  ];

  ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);

  const totalRevenue = await revenueAnalyticsServer.getTotalRevenue();
  expect(totalRevenue).toBe(350);
});
    it('getRevenueByCategory: should return revenue breakdown by item category', async () => {
        const mockOrders = [
  {
    getItem: () => ({ getCategory: () => ItemCategory.Cake }),
    getPrice: () => 100,
    getQuantity: () => 2,
    getid: () => 'order-1',
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.Book }),
    getPrice: () => 50,
    getQuantity: () => 3,
    getid: () => 'order-2',
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.Toy }),
    getPrice: () => 200,
    getQuantity: () => 1,
    getid: () => 'order-3',
  },
];

        ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);
        const revenueByCategory = await revenueAnalyticsServer.getRevenueByCategory();
        expect(revenueByCategory.get(ItemCategory.Cake)).toBe(200);
        expect(revenueByCategory.get(ItemCategory.Book)).toBe(150);

    });


});

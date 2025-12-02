import { ItemCategory } from "../../src/model/IItem";
import { OrderManagementServer } from "../../src/services/ordermanagement.server";
import { RevenueAnalyticsServer } from "../../src/services/revenueanalytics.server";


jest.mock('../../src/services/ordermanagement.server.ts');
    let revenueAnalyticsServer: RevenueAnalyticsServer;
    let ordermanagementServerMock: jest.Mocked<OrderManagementServer>;
describe('REvenue ANALYTICS SERVER tests', () => {

    beforeEach(() => {
        ordermanagementServerMock = new OrderManagementServer() as jest.Mocked<OrderManagementServer>;
        revenueAnalyticsServer = new RevenueAnalyticsServer(ordermanagementServerMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('getTotalRevenue: should return the total revenue from all orders', async () => {
        const mockOrders = [
            { getPrice: () => 100, getQuantity: () => 2 },
            { getPrice: () => 50, getQuantity: () => 3 },
        ];
        ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);

        const totalRevenue = await revenueAnalyticsServer.getTotalRevenue();
        expect(totalRevenue).toBe(350);
       
    });
    it('getRevenueByCategory: should return revenue breakdown by item category', async () => {
        const mockOrders = [
            { getItem: () => ({ getCategory:()=> ItemCategory.Cake}), getPrice: () => 100, getQuantity: () => 2 },
            { getItem: () => ({ getCategory: () => ItemCategory.Book }), getPrice: () => 50, getQuantity: () => 3 },
            { getItem: () => ({ getCategory: () => ItemCategory.Toy }), getPrice: () => 200, getQuantity: () => 1 },
        ];
        ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);
        const revenueByCategory = await revenueAnalyticsServer.getRevenueByCategory();
        expect(revenueByCategory.get(ItemCategory.Cake)).toBe(200);
        expect(revenueByCategory.get(ItemCategory.Book)).toBe(150);

    });


});

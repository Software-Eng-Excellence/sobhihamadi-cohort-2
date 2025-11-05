import { ItemCategory } from '../../src/model/IItem';
import { OrderManagementServer } from '../../src/services/ordermanagement.server';
import { OrderVolumeAnalyticsServer } from '../../src/services/OrderVolumeAnalytics.server';




jest.mock('../../src/services/ordermanagement.server.ts');
let orderVolumeAnalyticsServer: OrderVolumeAnalyticsServer;
    let ordermanagementServerMock: jest.Mocked<OrderManagementServer>;

describe('OrderVolumeAnalyticsServer', () => {
    


    beforeEach(() => {
        ordermanagementServerMock = new OrderManagementServer() as jest.Mocked<OrderManagementServer>;
        orderVolumeAnalyticsServer = new OrderVolumeAnalyticsServer(ordermanagementServerMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    test('getTotalOrders: should return the total number of orders', async () => {
      const mockOrders = [
            { getPrice: () => 100, getQuantity: () => 1, getItem: () => ({ getCategory: () => 'Book' }) },
            { getPrice: () => 200, getQuantity: () => 2, getItem: () => ({ getCategory: () => 'Book' }) },
            { getPrice: () => 300, getQuantity: () => 3, getItem: () => ({ getCategory: () => 'Cake' }) },
            { getPrice: () => 400, getQuantity: () => 4, getItem: () => ({ getCategory: () => 'Book' }) },
        ];

        ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);
        const totalOrders = await orderVolumeAnalyticsServer.getTotalOrders();
        expect(totalOrders).toBe(4);
        expect(ordermanagementServerMock.listOrders).toHaveBeenCalledTimes(1);
    });
    
     it('should return 0 when no orders', async () => {
            // Arrange
            ordermanagementServerMock.listOrders.mockResolvedValue([]);

            // Act
            const result = await orderVolumeAnalyticsServer.getTotalOrders();

            // Assert
            expect(result).toBe(0);
        });

    
});



  describe('getOrderCountsByCategory', () => {
        it('should count orders by category', async () => {
            // Arrange
            const mockOrders = [
                { getItem: () => ({ getCategory: () => ItemCategory.Cake }) },
                { getItem: () => ({ getCategory: () => ItemCategory.Book }) },
                { getItem: () => ({ getCategory: () => ItemCategory.Cake }) }
            ] as any;
            ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders);

            // Act
            const result = await orderVolumeAnalyticsServer.getOrderCountsByCategory();

            // Assert
            expect(result.get(ItemCategory.Cake)).toBe(2);
            expect(result.get(ItemCategory.Book)).toBe(1);
        });
          it('should return empty map when no orders', async () => {
            // Arrange
            ordermanagementServerMock.listOrders.mockResolvedValue([]);

            // Act
            const result = await orderVolumeAnalyticsServer.getOrderCountsByCategory();

            // Assert
            expect(result.size).toBe(0);
        });
  });
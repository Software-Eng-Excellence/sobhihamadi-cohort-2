import { ItemCategory } from '../../src/model/IItem';
import { OrderManagementService } from '../../src/services/OrderManagement/ordermanagement.server';
import { OrderVolumeAnalyticsService } from '../../src/services/OrderManagement/OrderVolumeAnalytics.server';




jest.mock('../../src/services/OrderManagement/ordermanagement.server.ts');
let orderVolumeAnalyticsServer: OrderVolumeAnalyticsService;
    let ordermanagementServerMock: jest.Mocked<OrderManagementService>;

describe('OrderVolumeAnalyticsServer', () => {
    


    beforeEach(() => {
        ordermanagementServerMock = new OrderManagementService() as jest.Mocked<OrderManagementService>;
        orderVolumeAnalyticsServer = new OrderVolumeAnalyticsService(ordermanagementServerMock);
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
            ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders);

            // Act
            const result = await orderVolumeAnalyticsServer.getOrderCountsByCategory();

            // Assert
            expect(result.get(ItemCategory.Cake)).toBe(1);
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
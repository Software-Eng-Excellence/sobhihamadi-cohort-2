import { OrderManagementServer } from "../../src/services/ordermanagement.server";
import { AdvancedAnalyticsServer } from "../../src/services/advancedanalytics.server";
import { RevenueAnalyticsServer } from "../../src/services/revenueanalytics.server";
import { OrderVolumeAnalyticsServer } from "../../src/services/OrderVolumeAnalytics.server";


jest.mock('../../src/services/ordermanagement.server.ts');
 let advancedAnalyticsService: AdvancedAnalyticsServer;
    let ordermanagementServerMock: jest.Mocked<OrderManagementServer>;
    let revenueAnalyticsServerMock: jest.Mocked<RevenueAnalyticsServer>;
    let orderVolumeAnalyticsServerMock: jest.Mocked<OrderVolumeAnalyticsServer>;

describe('Advanced Analytics Service Tests', () => {


    beforeEach(() => {
             ordermanagementServerMock = new OrderManagementServer() as jest.Mocked<OrderManagementServer>;
        revenueAnalyticsServerMock = new RevenueAnalyticsServer(ordermanagementServerMock) as jest.Mocked<RevenueAnalyticsServer>;
        orderVolumeAnalyticsServerMock = new OrderVolumeAnalyticsServer(ordermanagementServerMock) as jest.Mocked<OrderVolumeAnalyticsServer>;
        
        // Initialize the service with mocked dependencies
        advancedAnalyticsService = new AdvancedAnalyticsServer(
            orderVolumeAnalyticsServerMock,
            revenueAnalyticsServerMock,
            ordermanagementServerMock
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getAverageOrderValue: should return the average order value', async () => {
        const mockOrders = [
            { getPrice: () => 100, getQuantity: () => 2 },
            { getPrice: () => 50, getQuantity: () => 3 },
        ];
        ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);
        const averageOrderValue = await advancedAnalyticsService.getAverageOrderValue();
        expect(averageOrderValue).toBe(175);
    });

    it('price range distribution: should return the price range distribution', async () => {
        const mockOrders = [
            { getPrice: () => 50, getQuantity: () => 2 },
            { getPrice: () => 100, getQuantity: () => 3 },
            { getPrice: () => 200, getQuantity: () => 1 },
            { getPrice: () => 300, getQuantity: () => 6 },
            { getPrice: () => 2, getQuantity: () => 1 },
        ];
        ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);
        const priceRangeDistribution = await advancedAnalyticsService.getPriceRangeDistribution();
        expect(priceRangeDistribution.priceRanges.length).toBe(4);
        expect(priceRangeDistribution.priceRanges[0].range).toBe('$0-50');
        expect(priceRangeDistribution.priceRanges[0].count).toBe(2);
        expect(priceRangeDistribution.priceRanges[0].percentage).toBe(40);
        expect(priceRangeDistribution.priceRanges[1].range).toBe('$51-100');
        expect(priceRangeDistribution.priceRanges[1].count).toBe(1);
        expect(priceRangeDistribution.priceRanges[1].percentage).toBe(20);
        expect(priceRangeDistribution.priceRanges[2].range).toBe('$101-200');
        expect(priceRangeDistribution.priceRanges[2].count).toBe(1);
        expect(priceRangeDistribution.priceRanges[2].percentage).toBe(20);
        expect(priceRangeDistribution.priceRanges[3].range).toBe('$201+');
        expect(priceRangeDistribution.priceRanges[3].count).toBe(1);
        expect(priceRangeDistribution.priceRanges[3].percentage).toBe(20);





        });
    });
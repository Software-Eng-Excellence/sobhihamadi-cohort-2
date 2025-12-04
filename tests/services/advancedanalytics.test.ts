import { OrderManagementService } from "../../src/services/OrderManagement/ordermanagement.server";
import { AdvancedAnalyticsService } from "../../src/services/OrderManagement/advancedanalytics.server";
import { RevenueAnalyticsService } from "../../src/services/OrderManagement/revenueanalytics.server";
import { OrderVolumeAnalyticsService } from "../../src/services/OrderManagement/OrderVolumeAnalytics.server";
import { ItemCategory } from "../../src/model/IItem";

let advancedAnalyticsService: AdvancedAnalyticsService;
let ordermanagementServerMock: jest.Mocked<OrderManagementService>;
let revenueAnalyticsServer: RevenueAnalyticsService;
let orderVolumeAnalyticsServer: OrderVolumeAnalyticsService;

describe('Advanced Analytics Service Tests', () => {

  beforeEach(() => {
    // Manual mock of OrderManagementService
    ordermanagementServerMock = {
      listOrders: jest.fn(),
      // add other methods if AdvancedAnalyticsService / RevenueAnalyticsService need them
    } as unknown as jest.Mocked<OrderManagementService>;

    // Real service instances, but fed with the mocked orderManagement
    revenueAnalyticsServer = new RevenueAnalyticsService(ordermanagementServerMock);
    orderVolumeAnalyticsServer = new OrderVolumeAnalyticsService(ordermanagementServerMock);

    advancedAnalyticsService = new AdvancedAnalyticsService(
      orderVolumeAnalyticsServer,
      revenueAnalyticsServer,
      ordermanagementServerMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAverageOrderValue: should return the average order value', async () => {
const mockOrders = [
  {
    getItem: () => ({ getCategory: () => ItemCategory.Cake }),
    getPrice: () => 100,
    getQuantity: () => 2,
    getid: () => "order-1",
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.Book }),
    getPrice: () => 50,
    getQuantity: () => 3,
    getid: () => "order-2",
  },
];


    // total = 350, average (if by order count) = 175

    ordermanagementServerMock.listOrders.mockResolvedValue(mockOrders as any);

    const averageOrderValue = await advancedAnalyticsService.getAverageOrderValue();
    expect(averageOrderValue).toBe(175);
  });

  it('price range distribution: should return the price range distribution', async () => {
  const mockOrders = [
  {
    getItem: () => ({ getCategory: () => ItemCategory.Cake }),
    getPrice: () => 50,
    getQuantity: () => 2,
    getid: () => "order-1",
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.Book }),
    getPrice: () => 100,
    getQuantity: () => 3,
    getid: () => "order-2",
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.Toy }),
    getPrice: () => 200,
    getQuantity: () => 1,
    getid: () => "order-3",
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.Cake }),
    getPrice: () => 300,
    getQuantity: () => 6,
    getid: () => "order-4",
  },
  {
    getItem: () => ({ getCategory: () => ItemCategory.Book }),
    getPrice: () => 2,
    getQuantity: () => 1,
    getid: () => "order-5",
  },
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

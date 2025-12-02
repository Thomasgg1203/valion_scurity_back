import { DataSource } from 'typeorm';
import { CommodityEntity } from '../entities/commodity.entity';

/**
 * 🌱 Seeder for Commodity
 * Inserts all default commodities in uppercase with concise English descriptions.
 */
export const seedCommodities = async (dataSource: DataSource) => {
  console.log('⚙️ Starting Commodity seeding...');

  await dataSource.transaction(async (manager) => {
    const commodities = [
      { name: 'ALCOHOLIC BEVERAGES', description: 'Transportation of alcoholic products.' },
      { name: 'AUTO HAULERS', description: 'Transport of automobiles using specialized carriers.' },
      { name: 'BOAT', description: 'Cargo involving boats or marine vessels.' },
      { name: 'BUSINESS DOCUMENTS', description: 'Transport of corporate or legal documents.' },
      { name: 'CATTLE', description: 'Transportation of cattle livestock.' },
      { name: 'CIGARS', description: 'Transport of cigars and related tobacco goods.' },
      { name: 'TOBACCO', description: 'Transportation of tobacco products.' },
      { name: 'CLOTHING', description: 'Transport of garments and textile products.' },
      { name: 'COMPUTER', description: 'Shipment of computers and electronic devices.' },
      { name: 'HAZMAT', description: 'Hazardous materials requiring special handling.' },
      { name: 'FINE ARTS', description: 'Transport of artwork requiring high care.' },
      { name: 'HOUSEHOLD GOODS', description: 'Movement of household items and furniture.' },
      { name: 'JEWELRY', description: 'Transport of jewelry and valuable accessories.' },
      {
        name: 'PRECIOUS METALS',
        description: 'Shipment of gold, silver, or other precious metals.',
      },
      { name: 'EQUIPMENT', description: 'General transport of machinery or equipment.' },
      { name: 'MOBILE HOMES', description: 'Transportation of mobile or manufactured homes.' },
      { name: 'LIVESTOCK', description: 'Transport of live animals for agriculture.' },
      { name: 'NARCOTICS', description: 'Controlled substances requiring special authorization.' },
      { name: 'COPPER', description: 'Transport of copper materials.' },
      { name: 'COPPER PRODUCTS', description: 'Shipment of goods manufactured from copper.' },
      { name: 'PHARMACEUTICALS', description: 'Transport of medicine and medical supplies.' },
      { name: 'GRAIN', description: 'Shipment of grains and agricultural crops.' },
      { name: 'SCRAP METAL', description: 'Transport of scrap and recyclable metals.' },
      { name: 'CONSTRUCTION DEBRIS', description: 'Movement of construction waste materials.' },
      { name: 'GARBAGE', description: 'Transport of refuse and waste materials.' },
      { name: 'REFUSE', description: 'General waste transportation.' },
      { name: 'TRASH', description: 'Non-hazardous trash hauling.' },
      { name: 'WASTE', description: 'General waste material transport.' },
      { name: 'OVERSIZED', description: 'Transport of oversized loads requiring permits.' },
      { name: 'OVERWEIGHT', description: 'Shipment of overweight cargo.' },
      {
        name: 'DUMPING OPERATIONS',
        description: 'Cargo involving dumping or disposal operations.',
      },
      { name: 'CORROSIVE HAZMAT', description: 'Hazardous corrosive material transportation.' },
      { name: 'HAZARDOUS MATERIALS', description: 'General hazardous materials transport.' },
      { name: 'HOME DELIVERIES', description: 'Residential delivery of goods.' },
      { name: 'LOGS', description: 'Transport of logs and timber.' },
      { name: 'OILFIELD EQUIPMENT', description: 'Equipment used in oilfield operations.' },
      { name: 'RADIOACTIVE MATERIALS', description: 'Transport of radioactive substances.' },
      { name: 'FLAMMABLE MATERIALS OR LIQUIDS', description: 'Shipment of flammable substances.' },
      {
        name: 'LPG (LIQUEFIED PETROLEUM GAS)',
        description: 'Transport of liquefied petroleum gas.',
      },
      { name: 'POISONOUS MATERIALS', description: 'Handling and transport of toxic materials.' },
      { name: 'COAL', description: 'Shipment of coal and coal by-products.' },
      { name: 'GASOLINE', description: 'Transport of gasoline fuel.' },
      { name: 'FORESTRY', description: 'Forest-related products or materials.' },
      { name: 'LOGGING', description: 'Transportation of logging materials.' },
      { name: 'TIMBER', description: 'Shipment of timber products.' },
      { name: 'PULPWOOD', description: 'Transport of pulpwood for processing.' },
      { name: 'LOGGING EQUIPMENT', description: 'Tools and machines used for logging.' },
      { name: 'PASSENGERS', description: 'Transport involving passengers.' },
      { name: 'MOTOR VEHICLES USED', description: 'Hauling of used vehicles.' },
      { name: 'MOTOR VEHICLES NEW', description: 'Transport of new vehicles.' },
      { name: 'DIRT SAND AND GRAVEL', description: 'Shipment of dirt, sand, and gravel.' },
      { name: 'AMMUNITIONS OR FIRE ARMS', description: 'Transport of ammunition or firearms.' },
      { name: 'BAGGED CEMENT', description: 'Shipment of cement in bags.' },
      { name: 'CANNABIS', description: 'Transport of cannabis products.' },
      { name: 'CEMENT BLOCKS', description: 'Shipment of concrete or cement blocks.' },
      { name: 'CEMENT MIXER', description: 'Transport of cement mixing equipment.' },
      { name: 'CIRCUS', description: 'Transport of circus equipment or animals.' },
      { name: 'CARNIVAL', description: 'Cargo for carnival operations.' },
      { name: 'AMUSEMENTS', description: 'Amusement equipment transport.' },
      { name: 'CONCRETE MIXER', description: 'Shipment of concrete mixer units.' },
      { name: 'COTTON', description: 'Transport of cotton bales or goods.' },
      { name: 'CRASHED CARS', description: 'Shipment of damaged or salvaged vehicles.' },
      { name: 'DRIVING SCHOOL', description: 'Transport or use for driving school operations.' },
      { name: 'EGGS', description: 'Transport of eggs requiring careful handling.' },
      { name: 'FRAC SAND', description: 'Shipment of sand used in oilfield fracking.' },
      { name: 'JUNK', description: 'Transport of junk and salvage goods.' },
      { name: 'LIVE ANIMALS', description: 'Transport of live animals.' },
      { name: 'LIVERY OPERATIONS', description: 'Transport for hire or livery services.' },
      {
        name: 'LOGS, POLES, BEAM, LUMBER',
        description: 'Shipment of wood materials such as logs or beams.',
      },
      { name: 'MILK', description: 'Transport of dairy products.' },
      { name: 'MOBILE CRANE', description: 'Transport of mobile crane equipment.' },
      { name: 'OWNED GOODS', description: 'Goods owned by the insured during transport.' },
      { name: 'PREFABRICATED STEEL', description: 'Shipment of prefabricated steel components.' },
      { name: 'RENTALS', description: 'Cargo involving rental equipment or property.' },
      { name: 'LEASING', description: 'Goods transported under leasing operations.' },
      { name: 'DRIVE-AWAY OPERATIONS', description: 'Vehicles driven rather than hauled.' },
      { name: 'STEEL', description: 'Transport of steel materials.' },
      { name: 'US MAIL', description: 'Transport of U.S. postal mail.' },
      { name: 'MOTORCYCLES', description: 'Shipment of motorcycles.' },
      { name: 'ICE CREAM', description: 'Transport of frozen dessert products.' },
      { name: 'PRIVATE AUTOS', description: 'Shipment of private automobiles.' },
      { name: 'RECREATIONAL VEHICLES (RV)', description: 'Transport of recreational vehicles.' },
      { name: 'AGGREGATE', description: 'Transport of aggregates such as sand or stone.' },
      { name: 'GRASS', description: 'Shipment of grass or turf products.' },
      { name: 'ASPHALT', description: 'Transport of asphalt materials.' },
      { name: 'CHEMICALS', description: 'Shipment of chemical substances.' },
      { name: 'EXPLOSIVES', description: 'Transport of explosive materials.' },
      { name: 'OIL', description: 'Shipment of crude or refined oil.' },
      {
        name: 'INTERMODAL CONTAINERS',
        description: 'Transport of intermodal shipping containers.',
      },
      { name: 'FLY ASH', description: 'Shipment of ash from coal combustion.' },
      { name: 'HOUSE MOVERS', description: 'Transport related to moving houses or structures.' },
      { name: 'WINE', description: 'Transport of wine products.' },
      { name: 'BEER', description: 'Shipment of beer and related beverages.' },
      { name: 'ALCOHOL', description: 'Transport of alcoholic substances.' },
      { name: 'AGRICULTURAL SUPPLIES', description: 'Shipment of supplies for agricultural use.' },
      { name: 'PRODUCE GOODS', description: 'Transport of fresh produce.' },
      { name: 'SOLAR PANELS', description: 'Shipment of solar panel equipment.' },
      { name: 'MOBILE OFFICE TRAILER', description: 'Transport of mobile office trailers.' },
      { name: 'TELEPHONE POLES', description: 'Shipment of utility poles.' },
      { name: 'HOT MIX ASPHALT', description: 'Transport of hot asphalt mixtures.' },
      { name: 'EMPTY TRAILERS', description: 'Movement of empty trailers.' },
      { name: 'BEES', description: 'Transport of live bees.' },
      { name: 'FLOWERS', description: 'Shipment of flowers and floral products.' },
      { name: 'JET FUEL', description: 'Transport of aviation jet fuel.' },
      { name: 'PLANTS', description: 'Shipment of live plants or nursery goods.' },
      { name: 'ENERGY GENERATOR', description: 'Transport of generators or power units.' },
      { name: 'HOUSE SUPPLIES', description: 'Shipment of household supplies.' },
      { name: 'RECYCLING', description: 'Transport of recyclable materials.' },
      { name: 'WATER', description: 'Shipment of potable or industrial water.' },
      { name: 'GAS', description: 'Transport of gas products.' },
      { name: 'BUTANE', description: 'Shipment of butane fuel.' },
      { name: 'HANGING MEAT', description: 'Transport of hanging meat carcasses.' },
      { name: 'HANGING SWINGING', description: 'Shipment of swinging or hanging cargo.' },
      { name: 'MOTOR VEHICLES', description: 'Shipment of motor vehicles.' },
      {
        name: 'PIPES (METAL,PLASTIC,CEMENT)',
        description: 'Transport of pipes of various materials.',
      },
      { name: 'DEBRIS REMOVAL', description: 'Transport of debris removed from sites.' },
      { name: 'HAY', description: 'Shipment of hay bales.' },
      { name: 'LUMBER', description: 'Transport of lumber products.' },
      { name: 'POLES', description: 'Shipment of poles made of wood or metal.' },
      { name: 'HEAVY MACHINERY', description: 'Transport of large industrial machinery.' },
      { name: 'COILS', description: 'Shipment of metal or material coils.' },
      { name: 'FRAC WATER', description: 'Transport of water used in fracking operations.' },
      {
        name: 'LANDSCAPING EQUIPMENT',
        description: 'Transport of landscaping tools and machinery.',
      },
      {
        name: 'CARGO TRANSPORTED BY RAIL, AIR OR BUS',
        description: 'Goods moved via rail, air, or bus carriers.',
      },
      { name: 'HIGH FASHION CLOTHING', description: 'Shipment of luxury fashion garments.' },
      { name: 'MONEY', description: 'Transport of physical currency.' },
      { name: 'SECURITIES', description: 'Shipment of financial securities.' },
      { name: 'PERFUME', description: 'Transport of fragrance products.' },
      { name: 'PRECIOUS STONES', description: 'Shipment of gemstones.' },
      { name: 'EXOTIC ANIMALS', description: 'Transport of exotic or rare animals.' },
      { name: 'ZOO ANIMALS', description: 'Shipment of animals for zoo operations.' },
      {
        name: 'AUTOS - ANTIQUE VEHICLES',
        description: 'Transport of antique or collectible autos.',
      },
      { name: 'FUEL ROD', description: 'Shipment of nuclear fuel rods.' },
      { name: 'AIRBAGS', description: 'Transport of airbag components.' },
      { name: 'CURRENCY', description: 'Transport of currency notes.' },
      { name: 'PAINTINGS', description: 'Shipment of valuable paintings.' },
      {
        name: 'STATUARY AND OTHER WORKS OF ART',
        description: 'Transport of statues and artistic works.',
      },
      { name: 'MANUSCRIPTS', description: 'Shipment of manuscripts and written works.' },
      {
        name: 'MECHANICAL DRAWINGS',
        description: 'Transport of technical or engineering drawings.',
      },
      { name: 'FURS', description: 'Transport of fur products.' },
      { name: 'SEAFOOD FRESH', description: 'Shipment of freshly caught seafood.' },
      { name: 'HORTICULTURE', description: 'Transport of horticultural goods.' },
      { name: 'MACHINERY', description: 'Shipment of machinery and mechanical equipment.' },
      { name: 'COILED METALS', description: 'Transport of metal coils.' },
      { name: 'ON HOOK CARGO', description: 'Cargo suspended on hooks during transport.' },
      { name: 'FIREWORKS', description: 'Transport of fireworks and pyrotechnics.' },
      { name: 'AEROSOLS', description: 'Shipment of pressurized aerosols.' },
      { name: 'FUEL', description: 'General transport of fuel products.' },
      { name: 'FIREARMS', description: 'Transport of firearms requiring special handling.' },
      { name: 'FUSES', description: 'Shipment of explosives or ignition fuses.' },
      { name: 'NITROGLYCERIN', description: 'Transport of highly explosive nitroglycerin.' },
      { name: 'BUSES', description: 'Transport involving buses.' },
      { name: 'LIQUID HAULER', description: 'Transport of liquid products via tankers.' },
      {
        name: 'LUXURY COMMODITIES ( FURS, PRECIOUS METALS, FINE ART)',
        description: 'High-value luxury goods transport.',
      },
      { name: 'HOME APPLIANCES', description: 'Shipment of home appliances and electronics.' },
      {
        name: 'LIQUOR EXCEPT BEER & WINE',
        description: 'Transport of liquor excluding beer and wine.',
      },
      { name: 'FURNITURE', description: 'Shipment of furniture items.' },
      { name: 'STEEL COILS', description: 'Transport of steel coils.' },
    ];

    let inserted = 0;
    let skipped = 0;

    for (const item of commodities) {
      const exists = await manager.findOne(CommodityEntity, { where: { name: item.name } });

      if (!exists) {
        await manager.save(
          CommodityEntity,
          manager.create(CommodityEntity, {
            name: item.name,
            description: item.description,
          }),
        );
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Commodity seeding completed: ${inserted} inserted, ${skipped} skipped.`);
  });
};

from api.database import SessionLocal, engine
from api.models import Base, MenuCategory, MenuItem, InventoryItem, Vendor, Staff, RecipeBOM

def seed_all():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(MenuCategory).first():
        db.close()
        print("Database already seeded.")
        return
    
    # === MENU CATEGORIES ===
    categories = [
        MenuCategory(id="soups", name="Soups", icon="soup_kitchen", description="Warm, nourishing broths crafted with real ingredients", sort_order=1),
        MenuCategory(id="wraps", name="Wraps", icon="lunch_dining", description="Hand-rolled wraps with multigrain options", sort_order=2),
        MenuCategory(id="omelettes", name="Omelettes", icon="egg_alt", description="Farm-fresh egg creations, protein-packed", sort_order=3),
        MenuCategory(id="salads", name="Salads", icon="eco", description="Fresh greens with gourmet dressings", sort_order=4),
        MenuCategory(id="sandwiches", name="Sandwiches", icon="bread_slice", description="Artisanal breads with premium fillings", sort_order=5),
        MenuCategory(id="pasta", name="Pasta", icon="dinner_dining", description="Penne & spaghetti with artisanal sauces", sort_order=6),
        MenuCategory(id="burrito-bowls", name="Burrito Bowls", icon="rice_bowl", description="Loaded rice bowls with signature sauces", sort_order=7),
        MenuCategory(id="healthy-meals", name="Healthy Meals", icon="health_and_safety", description="Balanced plates for conscious eaters", sort_order=8),
        MenuCategory(id="breakfast", name="Breakfast", icon="wb_sunny", description="Start your day with clean energy", sort_order=9),
        MenuCategory(id="meal-boxes", name="Meal Boxes", icon="takeout_dining", description="Complete meals in a box", sort_order=10),
        MenuCategory(id="drinks", name="Drinks", icon="local_cafe", description="Refreshing beverages, zero guilt", sort_order=11),
        MenuCategory(id="detox", name="Detox Drinks", icon="spa", description="Cleanse and rejuvenate", sort_order=12),
        MenuCategory(id="smoothies", name="Smoothies", icon="blender", description="Thick, creamy nutrition blends", sort_order=13),
        MenuCategory(id="desserts", name="Desserts", icon="cake", description="Guilt-free indulgence", sort_order=14),
    ]
    db.add_all(categories)
    db.commit()
    
    # === MENU ITEMS (all 83 from the uploaded menu image) ===
    items = [
        # SOUPS (8 items)
        MenuItem(id="s1", name="Hot & Sour", price=80, calories=120, is_vegetarian=True, tags=["Low Cal","Vegan"], category_id="soups", protein=4, carbs=18, fat=3, sodium=180, cogs=32),
        MenuItem(id="s2", name="Manchow", price=80, calories=140, is_vegetarian=True, tags=["Spicy","Fiber+"], category_id="soups", protein=5, carbs=20, fat=4, sodium=220, cogs=35),
        MenuItem(id="s3", name="Cream of Mushroom", price=80, calories=180, is_vegetarian=True, tags=["Creamy","Protein+"], category_id="soups", protein=8, carbs=15, fat=10, sodium=150, cogs=38),
        MenuItem(id="s4", name="Broccoli Almond", price=160, calories=220, is_vegetarian=True, tags=["Calcium+","Keto"], category_id="soups", protein=10, carbs=8, fat=14, sodium=120, cogs=72),
        MenuItem(id="s5", name="Tomato Basil", price=160, calories=150, is_vegetarian=True, tags=["Vit C","Low Cal"], category_id="soups", protein=4, carbs=22, fat=5, sodium=140, cogs=55),
        MenuItem(id="s6", name="Pumpkin Soup", price=160, calories=170, is_vegetarian=True, tags=["Beta Carotene","Immunity"], category_id="soups", protein=5, carbs=25, fat=6, sodium=130, cogs=58),
        MenuItem(id="s7", name="Cream of Chicken", price=180, non_veg_price=180, calories=280, is_vegetarian=False, tags=["Protein+","Comfort"], category_id="soups", protein=22, carbs=18, fat=14, sodium=200, cogs=68),
        MenuItem(id="s8", name="Special Mutton Paye", price=200, non_veg_price=200, calories=350, is_vegetarian=False, tags=["Collagen","Rich"], category_id="soups", protein=28, carbs=12, fat=22, sodium=250, cogs=85),
        # WRAPS (8 items)
        MenuItem(id="w1", name="Paneer Tikka Wrap", price=160, calories=380, is_vegetarian=True, tags=["High Protein","Grilled"], category_id="wraps", protein=18, carbs=42, fat=16, sodium=180, cogs=52),
        MenuItem(id="w2", name="Falafel Hummus Wrap", price=160, calories=420, is_vegetarian=True, tags=["Mediterranean","Fiber+"], category_id="wraps", protein=14, carbs=48, fat=18, sodium=160, cogs=48),
        MenuItem(id="w3", name="Mushroom Tikka Wrap", price=160, calories=340, is_vegetarian=True, tags=["Umami","Low Cal"], category_id="wraps", protein=12, carbs=40, fat=14, sodium=150, cogs=45),
        MenuItem(id="w4", name="Paneer Burrito Wrap", price=160, calories=450, is_vegetarian=True, tags=["Mexican","Protein+"], category_id="wraps", protein=20, carbs=50, fat=18, sodium=200, cogs=55),
        MenuItem(id="w5", name="Mushroom Burrito Wrap", price=160, calories=390, is_vegetarian=True, tags=["Mexican","Vegan"], category_id="wraps", protein=14, carbs=48, fat=16, sodium=170, cogs=48),
        MenuItem(id="w6", name="Chicken Burrito Wrap", price=180, non_veg_price=180, calories=480, is_vegetarian=False, tags=["Mexican","Protein+"], category_id="wraps", protein=30, carbs=48, fat=18, sodium=220, cogs=68),
        MenuItem(id="w7", name="Chicken Tikka Wrap", price=180, non_veg_price=180, calories=460, is_vegetarian=False, tags=["Tandoori","Spicy"], category_id="wraps", protein=32, carbs=42, fat=18, sodium=210, cogs=72),
        MenuItem(id="w8", name="BBQ Chicken Wrap", price=180, non_veg_price=180, calories=470, is_vegetarian=False, tags=["Smoky","American"], category_id="wraps", protein=30, carbs=46, fat=18, sodium=230, cogs=70),
        # OMELETTES (7 items)
        MenuItem(id="o1", name="Pan Omelette (2 Eggs)", price=99, calories=180, is_vegetarian=True, tags=["Classic","Keto"], category_id="omelettes", protein=14, carbs=2, fat=12, sodium=140, cogs=35),
        MenuItem(id="o2", name="Veg Loaded Omelette", price=119, calories=220, is_vegetarian=True, tags=["Fiber+","Vitamins"], category_id="omelettes", protein=16, carbs=8, fat=14, sodium=160, cogs=42),
        MenuItem(id="o3", name="Tomato Cheese Omelette", price=129, calories=260, is_vegetarian=True, tags=["Calcium+","Comfort"], category_id="omelettes", protein=18, carbs=6, fat=18, sodium=180, cogs=48),
        MenuItem(id="o4", name="Mushroom Spinach Omelette", price=129, calories=240, is_vegetarian=True, tags=["Iron+","Keto"], category_id="omelettes", protein=16, carbs=4, fat=18, sodium=150, cogs=45),
        MenuItem(id="o5", name="French Omelette", price=129, calories=230, is_vegetarian=True, tags=["Classic","Low Carb"], category_id="omelettes", protein=16, carbs=3, fat=17, sodium=140, cogs=45),
        MenuItem(id="o6", name="Exotic Egg Bhurji (2 Egg)", price=119, calories=250, is_vegetarian=True, tags=["Indian","Spicy"], category_id="omelettes", protein=18, carbs=6, fat=16, sodium=190, cogs=42),
        MenuItem(id="o7", name="High Protein Chicken Omelette", price=149, non_veg_price=149, calories=320, is_vegetarian=False, tags=["Protein+","Fitness"], category_id="omelettes", protein=28, carbs=4, fat=20, sodium=200, cogs=58),
        # SALADS (8 items)
        MenuItem(id="sa1", name="Grilled Paneer Salad", price=200, calories=320, is_vegetarian=True, tags=["High Protein","Grilled"], category_id="salads", protein=22, carbs=14, fat=18, sodium=160, cogs=68),
        MenuItem(id="sa2", name="Rainbow Salad", price=220, calories=280, is_vegetarian=True, tags=["Balsamic","Vitamins"], category_id="salads", protein=8, carbs=32, fat=10, sodium=130, cogs=65),
        MenuItem(id="sa3", name="Veg Caesar Salad", price=200, calories=290, is_vegetarian=True, tags=["Classic","Calcium+"], category_id="salads", protein=14, carbs=16, fat=18, sodium=180, cogs=60),
        MenuItem(id="sa4", name="Roasted Veg Quinoa Salad", price=220, calories=340, is_vegetarian=True, tags=["Quinoa","Superfood"], category_id="salads", protein=12, carbs=38, fat=14, sodium=140, cogs=78),
        MenuItem(id="sa5", name="Falafel Garden Salad", price=200, calories=360, is_vegetarian=True, tags=["Mediterranean","Fiber+"], category_id="salads", protein=14, carbs=36, fat=18, sodium=150, cogs=62),
        MenuItem(id="sa6", name="Chicken Caesar Salad", price=240, non_veg_price=240, calories=380, is_vegetarian=False, tags=["Classic","Protein+"], category_id="salads", protein=32, carbs=14, fat=20, sodium=200, cogs=82),
        MenuItem(id="sa7", name="Grilled Chicken Salad", price=240, non_veg_price=240, calories=350, is_vegetarian=False, tags=["Lean","Fitness"], category_id="salads", protein=34, carbs=12, fat=16, sodium=180, cogs=85),
        MenuItem(id="sa8", name="Broccoli Lemon Chicken Salad", price=260, non_veg_price=260, calories=340, is_vegetarian=False, tags=["Vit C","Immunity"], category_id="salads", protein=32, carbs=16, fat=14, sodium=160, cogs=88),
        # SANDWICHES (7 items)
        MenuItem(id="sw1", name="Spinach & Corn Sandwich", price=170, calories=310, is_vegetarian=True, tags=["Fiber+","Classic"], category_id="sandwiches", protein=12, carbs=42, fat=10, sodium=160, cogs=55),
        MenuItem(id="sw2", name="Grilled Veggie Ranch", price=170, calories=330, is_vegetarian=True, tags=["Yogurt Dressing","Grilled"], category_id="sandwiches", protein=12, carbs=44, fat=12, sodium=170, cogs=58),
        MenuItem(id="sw3", name="Mushroom & Caramelised Onion", price=170, calories=340, is_vegetarian=True, tags=["Umami","Gourmet"], category_id="sandwiches", protein=12, carbs=46, fat=12, sodium=165, cogs=60),
        MenuItem(id="sw4", name="Grilled Paneer Ranch", price=170, calories=360, is_vegetarian=True, tags=["Protein+","Yogurt"], category_id="sandwiches", protein=18, carbs=40, fat=14, sodium=180, cogs=62),
        MenuItem(id="sw5", name="Veg Club Sandwich", price=190, calories=420, is_vegetarian=True, tags=["Triple Decker","Classic"], category_id="sandwiches", protein=16, carbs=52, fat=16, sodium=200, cogs=72),
        MenuItem(id="sw6", name="Chicken Club Sandwich", price=190, non_veg_price=190, calories=480, is_vegetarian=False, tags=["Triple Decker","Protein+"], category_id="sandwiches", protein=32, carbs=48, fat=20, sodium=240, cogs=88),
        MenuItem(id="sw7", name="Chicken Tikka Sandwich", price=190, non_veg_price=190, calories=460, is_vegetarian=False, tags=["Tandoori","Spicy"], category_id="sandwiches", protein=30, carbs=46, fat=18, sodium=230, cogs=85),
        # PASTA (4 items)
        MenuItem(id="p1", name="Alfredo", price=180, calories=480, is_vegetarian=True, tags=["Creamy","Comfort"], category_id="pasta", protein=16, carbs=56, fat=22, sodium=250, cogs=72),
        MenuItem(id="p2", name="Arrabiata", price=180, calories=420, is_vegetarian=True, tags=["Spicy","Tomato"], category_id="pasta", protein=14, carbs=58, fat=14, sodium=220, cogs=65),
        MenuItem(id="p3", name="Pesto", price=190, calories=450, is_vegetarian=True, tags=["Basil","Mediterranean"], category_id="pasta", protein=16, carbs=48, fat=20, sodium=200, cogs=70),
        MenuItem(id="p4", name="Aglio Olio", price=190, calories=400, is_vegetarian=True, tags=["Garlic","Classic"], category_id="pasta", protein=12, carbs=52, fat=16, sodium=180, cogs=68),
        # BURRITO BOWLS (3 items)
        MenuItem(id="bb1", name="Paneer Rice Bowl", price=249, calories=520, is_vegetarian=True, tags=["Protein+","Mexican"], category_id="burrito-bowls", protein=22, carbs=58, fat=18, sodium=220, cogs=92),
        MenuItem(id="bb2", name="Mushroom Rice Bowl", price=249, calories=480, is_vegetarian=True, tags=["Vegan","Umami"], category_id="burrito-bowls", protein=16, carbs=56, fat=16, sodium=200, cogs=88),
        MenuItem(id="bb3", name="Chicken Rice Bowl", price=249, non_veg_price=249, calories=580, is_vegetarian=False, tags=["Protein+","BBQ"], category_id="burrito-bowls", protein=36, carbs=56, fat=20, sodium=260, cogs=105),
        # HEALTHY MEALS (6 items)
        MenuItem(id="hm1", name="Marry Me Mushroom", price=299, calories=420, is_vegetarian=True, tags=["Gourmet","Low Cal"], category_id="healthy-meals", protein=14, carbs=38, fat=22, sodium=140, cogs=120),
        MenuItem(id="hm2", name="Tawa Chicken", price=299, non_veg_price=299, calories=520, is_vegetarian=False, tags=["Indian","Protein+"], category_id="healthy-meals", protein=38, carbs=32, fat=24, sodium=220, cogs=82),
        MenuItem(id="hm3", name="Grilled Chicken + Veggies + Mash", price=299, non_veg_price=299, calories=480, is_vegetarian=False, tags=["Balanced","Fitness"], category_id="healthy-meals", protein=34, carbs=36, fat=18, sodium=180, cogs=85),
        MenuItem(id="hm4", name="Stuffed Chicken + Salsa + Mash", price=299, non_veg_price=299, calories=510, is_vegetarian=False, tags=["Mexican","Protein+"], category_id="healthy-meals", protein=36, carbs=38, fat=20, sodium=200, cogs=90),
        MenuItem(id="hm5", name="Grilled Paneer + Sauteed Veg", price=199, calories=380, is_vegetarian=True, tags=["Keto","High Protein"], category_id="healthy-meals", protein=22, carbs=18, fat=24, sodium=160, cogs=75),
        MenuItem(id="hm6", name="Quinoa Khichdi", price=150, calories=320, is_vegetarian=True, tags=["Superfood","Gut Health"], category_id="healthy-meals", protein=12, carbs=44, fat=10, sodium=120, cogs=42),
        # BREAKFAST (9 items)
        MenuItem(id="b1", name="English Breakfast", price=220, non_veg_price=220, calories=580, is_vegetarian=False, tags=["Classic","Full Plate"], category_id="breakfast", protein=26, carbs=52, fat=26, sodium=280, cogs=95),
        MenuItem(id="b2", name="Clean Vegetable Pakora", price=99, calories=240, is_vegetarian=True, tags=["Crispy","Tea Time"], category_id="breakfast", protein=6, carbs=28, fat=12, sodium=180, cogs=32),
        MenuItem(id="b3", name="Date Banana Pancakes (4 pcs)", price=170, calories=360, is_vegetarian=True, tags=["Sweet","No Refined Sugar"], category_id="breakfast", protein=10, carbs=52, fat=12, sodium=140, cogs=55),
        MenuItem(id="b4", name="Boiled Eggs (3) + Sauteed Veggies", price=105, non_veg_price=105, calories=280, is_vegetarian=False, tags=["Keto","Protein+"], category_id="breakfast", protein=22, carbs=8, fat=18, sodium=160, cogs=38),
        MenuItem(id="b5", name="Morning Deli Chilla with Curd", price=129, calories=320, is_vegetarian=True, tags=["Indian","Probiotic"], category_id="breakfast", protein=14, carbs=38, fat=12, sodium=150, cogs=48),
        MenuItem(id="b6", name="Egg Pakodas", price=129, non_veg_price=129, calories=300, is_vegetarian=False, tags=["Crispy","Protein+"], category_id="breakfast", protein=18, carbs=22, fat=16, sodium=200, cogs=45),
        MenuItem(id="b7", name="Classic French Toast", price=149, calories=340, is_vegetarian=True, tags=["Sweet","Classic"], category_id="breakfast", protein=12, carbs=46, fat=12, sodium=140, cogs=52),
        MenuItem(id="b8", name="Avocado Toast + Sunny Side Up", price=299, non_veg_price=299, calories=450, is_vegetarian=False, tags=["Healthy Fats","Trendy"], category_id="breakfast", protein=18, carbs=30, fat=28, sodium=180, cogs=95),
        MenuItem(id="b9", name="Boiled Egg (1 pc)", price=15, non_veg_price=15, calories=70, is_vegetarian=False, tags=["Quick","Protein"], category_id="breakfast", protein=6, carbs=1, fat=5, sodium=60, cogs=5),
        # MEAL BOXES (3 items)
        MenuItem(id="mb1", name="Veg Meal Box", price=199, calories=520, is_vegetarian=True, tags=["Balanced","Complete"], category_id="meal-boxes", protein=16, carbs=58, fat=18, sodium=200, cogs=72),
        MenuItem(id="mb2", name="Paneer Meal Box", price=249, calories=580, is_vegetarian=True, tags=["Protein+","Complete"], category_id="meal-boxes", protein=24, carbs=56, fat=22, sodium=220, cogs=88),
        MenuItem(id="mb3", name="Chicken Meal Box", price=299, non_veg_price=299, calories=650, is_vegetarian=False, tags=["Protein+","Complete"], category_id="meal-boxes", protein=40, carbs=52, fat=26, sodium=280, cogs=105),
        # DRINKS (8 items)
        MenuItem(id="d1", name="Watermelon Juice", price=149, calories=80, is_vegetarian=True, tags=["Hydrating","Vitamins"], category_id="drinks", protein=1, carbs=18, fat=0, sodium=10, cogs=35),
        MenuItem(id="d2", name="Good Karma Cooler", price=129, calories=60, is_vegetarian=True, tags=["Refreshing","Detox"], category_id="drinks", protein=0, carbs=14, fat=0, sodium=8, cogs=28),
        MenuItem(id="d3", name="Mint Aloe Fresca", price=119, calories=45, is_vegetarian=True, tags=["Cooling","Skin Health"], category_id="drinks", protein=0, carbs=10, fat=0, sodium=5, cogs=25),
        MenuItem(id="d4", name="Gold Chili Cooler", price=119, calories=50, is_vegetarian=True, tags=["Spicy","Metabolism"], category_id="drinks", protein=0, carbs=12, fat=0, sodium=12, cogs=25),
        MenuItem(id="d5", name="Lychee Mint Cooler", price=119, calories=70, is_vegetarian=True, tags=["Sweet","Refreshing"], category_id="drinks", protein=0, carbs=16, fat=0, sodium=8, cogs=25),
        MenuItem(id="d6", name="Watermelon Cooler", price=119, calories=60, is_vegetarian=True, tags=["Hydrating","Summer"], category_id="drinks", protein=0, carbs=14, fat=0, sodium=6, cogs=22),
        MenuItem(id="d7", name="Mango Mint Cooler", price=119, calories=85, is_vegetarian=True, tags=["Tropical","Sweet"], category_id="drinks", protein=0, carbs=20, fat=0, sodium=8, cogs=28),
        MenuItem(id="d8", name="Zero-Cal Mint Mojito", price=80, calories=10, is_vegetarian=True, tags=["Zero Cal","Refreshing"], category_id="drinks", protein=0, carbs=2, fat=0, sodium=5, cogs=15),
        # DETOX (4 items)
        MenuItem(id="de1", name="ABC (Apple Beetroot Carrot)", price=149, calories=90, is_vegetarian=True, tags=["Classic Detox","Vitamins"], category_id="detox", protein=2, carbs=20, fat=0, sodium=15, cogs=38),
        MenuItem(id="de2", name="Lemon Mint Iced Tea", price=80, calories=30, is_vegetarian=True, tags=["Cooling","Low Cal"], category_id="detox", protein=0, carbs=6, fat=0, sodium=8, cogs=18),
        MenuItem(id="de3", name="Chia Lemonades Detox", price=120, calories=50, is_vegetarian=True, tags=["Chia Seeds","Fiber+"], category_id="detox", protein=1, carbs=10, fat=1, sodium=10, cogs=32),
        MenuItem(id="de4", name="Antioxidant Detox", price=149, calories=70, is_vegetarian=True, tags=["Berry Blend","Immunity"], category_id="detox", protein=1, carbs=16, fat=0, sodium=12, cogs=38),
        # SMOOTHIES (5 items)
        MenuItem(id="sm1", name="Date Banana Smoothie", price=120, calories=280, is_vegetarian=True, tags=["Energy","No Sugar"], category_id="smoothies", protein=6, carbs=48, fat=8, sodium=20, cogs=38),
        MenuItem(id="sm2", name="Peanut Butter Banana Smoothie", price=120, calories=340, is_vegetarian=True, tags=["Protein+","Fitness"], category_id="smoothies", protein=14, carbs=38, fat=16, sodium=25, cogs=42),
        MenuItem(id="sm3", name="Avocado Green Smoothie", price=149, calories=300, is_vegetarian=True, tags=["Healthy Fats","Keto"], category_id="smoothies", protein=6, carbs=18, fat=22, sodium=18, cogs=48),
        MenuItem(id="sm4", name="Apple Cinnamon Smoothie", price=149, calories=260, is_vegetarian=True, tags=["Autumn","Metabolism"], category_id="smoothies", protein=4, carbs=44, fat=8, sodium=15, cogs=45),
        MenuItem(id="sm5", name="Powerhouse Green Smoothie", price=149, calories=220, is_vegetarian=True, tags=["Superfood","Vitamins"], category_id="smoothies", protein=8, carbs=28, fat=8, sodium=12, cogs=48),
        # DESSERTS (3 items)
        MenuItem(id="ds1", name="Fruit Grana Yogurt", price=139, calories=180, is_vegetarian=True, tags=["Probiotic","Fresh"], category_id="desserts", protein=10, carbs=24, fat=6, sodium=35, cogs=42),
        MenuItem(id="ds2", name="Healthy Tiramisu Box", price=169, calories=320, is_vegetarian=True, tags=["Italian","Coffee"], category_id="desserts", protein=8, carbs=38, fat=14, sodium=45, cogs=58),
        MenuItem(id="ds3", name="Ragi Dates Jaggery Brownie", price=149, calories=280, is_vegetarian=True, tags=["No Refined Sugar","Fiber+"], category_id="desserts", protein=6, carbs=36, fat=12, sodium=30, cogs=48),
    ]
    db.add_all(items)
    db.commit()
    
    # === INVENTORY ===
    inventory = [
        InventoryItem(id="ING-001", name="Organic Paneer", group="Dairy", uom="kg", stock_qty=12.5, reorder_level=5, rate=320, valuation=3200, batch_number="BTH-240401", shelf_life_days=7),
        InventoryItem(id="ING-002", name="Free-Range Eggs", group="Dairy", uom="dozen", stock_qty=24, reorder_level=10, rate=180, valuation=4320, batch_number="BTH-240415", shelf_life_days=14),
        InventoryItem(id="ING-003", name="Quinoa (Organic)", group="Grains", uom="kg", stock_qty=8, reorder_level=3, rate=450, valuation=3600, batch_number="BTH-240320", shelf_life_days=180),
        InventoryItem(id="ING-004", name="Extra Virgin Olive Oil", group="Oils", uom="L", stock_qty=6, reorder_level=2, rate=850, valuation=5100, batch_number="BTH-240205", shelf_life_days=365),
        InventoryItem(id="ING-005", name="Fresh Chicken Breast", group="Meat", uom="kg", stock_qty=15, reorder_level=8, rate=280, valuation=4200, batch_number="BTH-240425", shelf_life_days=3),
        InventoryItem(id="ING-006", name="Broccoli (Fresh)", group="Vegetables", uom="kg", stock_qty=9, reorder_level=4, rate=120, valuation=1080, batch_number="BTH-240424", shelf_life_days=5),
        InventoryItem(id="ING-007", name="Avocado (Hass)", group="Vegetables", uom="kg", stock_qty=5, reorder_level=2, rate=380, valuation=1900, batch_number="BTH-240423", shelf_life_days=4),
        InventoryItem(id="ING-008", name="Almonds (Raw)", group="Nuts", uom="kg", stock_qty=4, reorder_level=2, rate=650, valuation=2600, batch_number="BTH-240315", shelf_life_days=120),
        InventoryItem(id="ING-009", name="Whole Wheat Flour", group="Grains", uom="kg", stock_qty=20, reorder_level=10, rate=65, valuation=1300, batch_number="BTH-240410", shelf_life_days=90),
        InventoryItem(id="ING-010", name="Greek Yogurt", group="Dairy", uom="kg", stock_qty=10, reorder_level=5, rate=220, valuation=2200, batch_number="BTH-240421", shelf_life_days=10),
    ]
    db.add_all(inventory)
    db.commit()
    
    # === VENDORS ===
    vendors = [
        Vendor(id=1, name="Fresh Farms Pvt Ltd", contact="+91-9876543211", lead_time_hours=6, min_order_qty=5, rating=4.8),
        Vendor(id=2, name="Organic Grains Co", contact="+91-9876543212", lead_time_hours=24, min_order_qty=3, rating=4.9),
        Vendor(id=3, name="Green Valley Produce", contact="+91-9876543213", lead_time_hours=12, min_order_qty=2, rating=4.7),
        Vendor(id=4, name="Premium Meats", contact="+91-9876543214", lead_time_hours=8, min_order_qty=5, rating=4.6),
        Vendor(id=5, name="Mediterranean Imports", contact="+91-9876543215", lead_time_hours=48, min_order_qty=10, rating=4.9),
    ]
    db.add_all(vendors)
    db.commit()
    
    # === STAFF ===
    staff = [
        Staff(id=1, employee_code="CHF-001", name="Rajesh K.", department="Kitchen", role="Kitchen Manager", salary_inr=45000, shift_start="6AM", shift_end="2PM", hygiene_score=98, avg_prep_time_min=11.8, orders_completed=127, status="Active", zone="Main Kitchen"),
        Staff(id=2, employee_code="CHF-002", name="Priya M.", department="Kitchen", role="Sous Chef", salary_inr=28000, shift_start="5AM", shift_end="1PM", hygiene_score=97, avg_prep_time_min=13.2, orders_completed=98, status="Active", zone="Main Kitchen"),
        Staff(id=3, employee_code="CHF-003", name="Amit S.", department="Kitchen", role="Dishwasher & Prep", salary_inr=18000, shift_start="4:30AM", shift_end="12:30PM", hygiene_score=96, avg_prep_time_min=15.5, orders_completed=76, status="Active", zone="Main Kitchen"),
        Staff(id=4, employee_code="DLV-001", name="Vikram D.", department="Delivery", role="Delivery Manager", salary_inr=35000, shift_start="7AM", shift_end="3PM", orders_completed=340, status="Active", zone="All Zones", bike="UP16 GH 3456", phone="98765 43213", rating=4.7, deliveries=340),
        Staff(id=5, employee_code="DLV-002", name="Rohit N.", department="Delivery", role="Delivery Rider", salary_inr=650, shift_start="6AM", shift_end="2PM", orders_completed=18, status="On Break", zone="Sector 50-62", bike="UP16 AB 1234", phone="98765 43210", rating=4.9, deliveries=1240),
        Staff(id=6, employee_code="CHF-004", name="Sunita R.", department="Kitchen", role="Sous Chef", salary_inr=28000, shift_start="2PM", shift_end="10PM", hygiene_score=99, avg_prep_time_min=12.1, orders_completed=112, status="Active", zone="Main Kitchen"),
    ]
    db.add_all(staff)
    db.commit()
    
    db.close()
    print("Database seeded successfully!")
    print(f"  Categories: {len(categories)}")
    print(f"  Menu Items: {len(items)}")
    print(f"  Inventory: {len(inventory)}")
    print(f"  Vendors: {len(vendors)}")
    print(f"  Staff: {len(staff)}")

if __name__ == "__main__":
    seed_all()

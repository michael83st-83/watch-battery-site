# 🕰️ SamiWatches Premium Watch Dataset

## 📋 Dataset Overview

This dataset contains comprehensive information about **1,670 premium watches** scraped from SamiWatches, one of Turkey's leading luxury watch retailers. The dataset includes detailed specifications, pricing, and technical features of watches from 22 prestigious brands.

### 🎯 Key Features
- **1,670 unique watch products** from 22 premium brands
- **42 detailed features** (optimized) including technical specifications, pricing, and brand information
- **96.71% data completeness** (improved) after professional cleaning and preprocessing
- **Price range**: ₺13,800 - ₺7,321,600 (Turkish Lira)
- **Average price**: ₺350,041
- **Memory usage**: 3.23 MB (optimized)

## 🏷️ Dataset Structure

### 📊 Main Categories

| Category | Features | Description |
|----------|----------|-------------|
| **Basic Info** | name, MARKA, KOLEKSIYON | Product identification and brand information |
| **Pricing** | price, price_category, price_percentile | Comprehensive pricing analysis |
| **Technical** | MEKANIZMA, KASA MATERYALI, KASA ÇAPI | Watch specifications and materials |
| **Features** | SU REZISTANSI, GÜÇ REZERVI, CINSIYET | Functional characteristics |
| **Enhanced** | brand_country, brand_age, collection_price_tier | Derived analytical features |

### 🔍 Detailed Feature Descriptions

#### Core Features
- **name**: Product name
- **MARKA**: Brand name (22 unique brands)
- **KOLEKSIYON**: Collection name (77 unique collections)
- **price**: Price in Turkish Lira (₺)
- **CINSIYET**: Target gender (Men/Women/Unisex)
- **MEKANIZMA**: Movement type (Automatic/Quartz/Manual)

#### Technical Specifications
- **KASA MATERYALI**: Case material (Steel, Gold, Titanium, etc.)
- **KASA ÇAPI**: Case diameter in mm
- **SU REZISTANSI**: Water resistance rating
- **GÜÇ REZERVI**: Power reserve duration
- **KAYIŞ**: Strap/bracelet material

#### Enhanced Analytics Features
- **price_category**: Budget/Mid-Range/Luxury/Ultra-Luxury
- **brand_country**: Brand origin country
- **brand_age**: Brand establishment age
- **case_material_category**: Standardized material categories
- **water_resistance_category**: Standardized resistance levels
- **collection_price_tier**: Collection pricing tier
- **price_vs_brand_avg**: Price position relative to brand average
- **is_price_outlier**: Price anomaly detection

## 📈 Dataset Statistics

### Brand Distribution
- **Swiss brands**: 18 (78.3%)
- **Italian brands**: 2 (8.7%)
- **French brands**: 1 (4.3%)
- **German brands**: 1 (4.3%)
- **Other/Unknown**: 1 (4.3%)

### Price Distribution
- **Budget** (≤₺100,000): 457 products (27.4%)
- **Mid-Range** (₺100,001-₺300,000): 636 products (38.1%)
- **Luxury** (₺300,001-₺500,000): 271 products (16.2%)
- **Ultra-Luxury** (>₺500,000): 306 products (18.3%)

### Technical Features
- **Movement Types**: Automatic (majority), Quartz, Manual
- **Case Materials**: Steel (52.5%), Gold (12.9%), Titanium (6.2%)
- **Water Resistance**: From splash-resistant to professional diving
- **Gender Distribution**: Men's, Women's, and Unisex models

## 🛠️ Data Processing Pipeline

### 1. Data Collection
- **Source**: SamiWatches.com (Premium watch retailer)
- **Method**: Selenium-based web scraping
- **Coverage**: All 23 pages of product catalog
- **Date**: October 2024

### 2. Data Cleaning
- Removed low-quality columns (>95% missing data)
- Standardized price formats and currency
- Cleaned text fields and removed inconsistencies
- Handled missing values appropriately

### 3. Feature Engineering
- Created price analysis features
- Added brand information (country, age, prestige)
- Standardized technical specifications
- Generated categorical groupings

### 4. Quality Assurance
- **Data completeness**: 94.7%
- **Duplicate removal**: 0 duplicates found
- **Outlier detection**: 3.4% price outliers identified
- **Type optimization**: Efficient data types for analysis

## 🎯 Use Cases

### 📊 Market Analysis
- Luxury watch market trends in Turkey
- Brand positioning and pricing strategies
- Collection performance analysis
- Price prediction modeling

### 🔍 Consumer Insights
- Gender preferences in luxury watches
- Technical feature importance
- Brand loyalty patterns
- Price sensitivity analysis

### 🤖 Machine Learning Applications
- **Price prediction**: Predict watch prices based on features
- **Brand classification**: Classify watches by brand characteristics
- **Recommendation systems**: Suggest similar watches
- **Market segmentation**: Identify customer segments

### 📈 Business Intelligence
- Inventory optimization
- Competitive analysis
- Market positioning
- Trend forecasting

## 📁 Files Included

1. **samiwatches_final_kaggle_YYYYMMDD_HHMMSS.csv** - Main dataset
2. **samiwatches_final_kaggle_YYYYMMDD_HHMMSS_summary.json** - Dataset summary statistics
3. **README.md** - This documentation file
4. **VERI_SETI_RAPORU.md** - Detailed Turkish analysis report

## 🔧 Technical Requirements

### Python Libraries
```python
pandas>=1.3.0
numpy>=1.21.0
matplotlib>=3.4.0
seaborn>=0.11.0
scikit-learn>=1.0.0
```

### Loading the Dataset
```python
import pandas as pd

# Load the dataset
df = pd.read_csv('samiwatches_final_kaggle_YYYYMMDD_HHMMSS.csv')

# Basic info
print(f"Dataset shape: {df.shape}")
print(f"Brands: {df['MARKA'].nunique()}")
print(f"Price range: ₺{df['price'].min():,.0f} - ₺{df['price'].max():,.0f}")
```

## 📊 Sample Analysis

### Price Analysis by Brand
```python
# Top 10 most expensive brands by average price
brand_prices = df.groupby('MARKA')['price'].agg(['mean', 'count']).sort_values('mean', ascending=False)
print(brand_prices.head(10))
```

### Technical Features Distribution
```python
# Movement type distribution
print(df['MEKANIZMA'].value_counts())

# Case material distribution
print(df['case_material_category'].value_counts())
```

## ⚖️ Data Ethics & Legal

- **Source**: Publicly available product information
- **Purpose**: Educational and research use
- **Compliance**: Respects robots.txt and rate limiting
- **Privacy**: No personal or sensitive information included
- **Commercial Use**: Please verify with original source terms

## 🤝 Contributing

This dataset was created for educational and research purposes. If you use this dataset in your research or projects, please consider:

1. **Citation**: Acknowledge the data source and collection methodology
2. **Feedback**: Share insights or improvements
3. **Collaboration**: Contribute to dataset enhancement

## 📞 Contact & Support

For questions, suggestions, or collaboration opportunities:
- **Dataset Issues**: Please report any data quality issues
- **Research Collaboration**: Open to academic partnerships
- **Commercial Inquiries**: Contact for business applications

## 🏆 Acknowledgments

- **SamiWatches**: For providing comprehensive product information
- **Watch Industry**: For creating these masterpieces of craftsmanship
- **Open Source Community**: For the tools that made this possible

---

**Last Updated**: October 2024  
**Version**: 1.0  
**License**: Educational Use  
**Language**: English (with Turkish brand names preserved)
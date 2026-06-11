import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface Root {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

const App = () => {
  const [product, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<Boolean>(true);
  const [search, setSearch] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState<any>(false);
  const [filteredProduct, setFilteredProduct] = React.useState<any[]>([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const json = await response.json();
      setProducts(json?.products);
      setFilteredProduct(json?.products);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProduct();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text === '') {
      setFilteredProduct(product);
    } else {
      const filtered = product.filter(item =>
        item?.title?.toLowerCase()?.includes(text?.toLowerCase()),
      );
      setFilteredProduct(filtered);
    }
  };

  const renderItem = ({ item }: { item: Root }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnailImage}
          resizeMode="contain"
        />

        <View style={styles.footer}>
          <Text numberOfLines={1} style={styles.productTitle}>
            {item?.title}
          </Text>
          <Image
            source={require('./assets/back.png')}
            style={styles.backIcon}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size={'large'} color={'#000'} />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#E2DCFF', '#FFF8F5']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Product List</Text>

        <View style={styles.searchContainer}>
          <TextInput
            value={search}
            style={styles.searchInput}
            placeholder="Search"
            onChangeText={handleSearch}
            placeholderTextColor={'#999'}
          />
          <Image
            source={require('./assets/search.png')}
            style={styles.searchIcon}
          />
        </View>

        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={filteredProduct}
          renderItem={renderItem}
          keyExtractor={item => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Product Found</Text>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edededff',
    paddingHorizontal: 16,
  },
  safeArea: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 150,
  },
  title: {
    fontSize: 30,
    fontWeight: 600,
    marginTop: 15,
    marginBottom: 20,
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#efefefff',
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'blue',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#000',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#efefefff',
  },
  thumbnailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: '#000',
    width: '90%',
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: 'blue',
  },
});

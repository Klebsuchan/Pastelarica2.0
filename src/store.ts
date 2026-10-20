import { useState, useEffect } from 'react';
import { Product, Category, StoreSettings } from './types';
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch, getDocs, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const CURRENT_MENU_VERSION = '2026_10_cardapio_v2';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Salgados' },
  { id: 'c2', name: 'Doces' },
  { id: 'c3', name: 'Adicionais' },
];

const INITIAL_PRODUCTS: Product[] = [
  // Salgados
  {
    id: '1',
    categoryId: 'c1',
    name: '1. Carne e queijo',
    description: 'Pastel crocante recheado com carne temperada e queijo mussarela derretido.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/pastelcarnequeijo.jpg'
  },
  {
    id: '2',
    categoryId: 'c1',
    name: '2. Carne, calabresa e queijo',
    description: 'Combinação saborosa de carne moída, calabresa selecionada e queijo derretido.',
    price: 21.00,
    prices: { P: 21.00, M: 26.00, G: 32.00 },
    imageUrl: '/pastelcarne.jpg'
  },
  {
    id: '3',
    categoryId: 'c1',
    name: '3. Carne, bacon e queijo',
    description: 'Carne suculenta com cubos de bacon crocante e bastante queijo mussarela.',
    price: 23.00,
    prices: { P: 23.00, M: 28.00, G: 35.00 },
    imageUrl: '/pastelcarnequeijo.jpg'
  },
  {
    id: '4',
    categoryId: 'c1',
    name: '4. Frango e queijo',
    description: 'Frango desfiado temperado na medida certa com queijo mussarela derretido.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/pastelfrango.webp'
  },
  {
    id: '5',
    categoryId: 'c1',
    name: '5. Frango e catupiry',
    description: 'Clássico frango desfiado super cremoso com catupiry.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/pastelfrangocatupiry.png'
  },
  {
    id: '6',
    categoryId: 'c1',
    name: '6. Carne, frango, calabresa e catupiry',
    description: 'Recheio super completo com carne, frango desfiado, calabresa e catupiry cremoso.',
    price: 24.00,
    prices: { P: 24.00, M: 29.00, G: 35.00 },
    imageUrl: '/frangocalabresaqueijo.jpg'
  },
  {
    id: '7',
    categoryId: 'c1',
    name: '7. Calabresa e queijo',
    description: 'Calabresa saborosa acompanhada de queijo mussarela derretido.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/calabresaqueijo.jpg'
  },
  {
    id: '8',
    categoryId: 'c1',
    name: '8. Calabresa e cheddar',
    description: 'Calabresa selecionada combinada com cheddar super cremoso.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/calabresachedar.jpg'
  },
  {
    id: '9',
    categoryId: 'c1',
    name: '9. Queijo, tomate, orégano e manjericão',
    description: 'Queijo derretido com tomate fresco, orégano e toque especial de manjericão.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/romeujulieta.jpg'
  },
  {
    id: '10',
    categoryId: 'c1',
    name: '10. Quatro queijos',
    description: 'Mussarela, catupiry, provolone e parmesão.',
    price: 24.00,
    prices: { P: 24.00, M: 29.00, G: 35.00 },
    imageUrl: '/pastelfrangochedar.jpg'
  },
  {
    id: '11',
    categoryId: 'c1',
    name: '11. Bacon e queijo',
    description: 'Bastante bacon crocante com queijo mussarela derretido.',
    price: 23.00,
    prices: { P: 23.00, M: 28.00, G: 35.00 },
    imageUrl: '/pastelchedar.jpg'
  },

  // Doces
  {
    id: '12',
    categoryId: 'c2',
    name: '1. Strogonoff de bombom',
    description: 'Bombom e leite condensado.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/pastelchocobranco.jpg'
  },
  {
    id: '13',
    categoryId: 'c2',
    name: '2. Chocolate ao leite',
    description: 'Recheio generoso de chocolate ao leite derretido.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/pastelchocolate.jpg'
  },
  {
    id: '14',
    categoryId: 'c2',
    name: '3. Banof',
    description: 'Banana, doce de leite e canela.',
    price: 18.00,
    prices: { P: 18.00, M: 23.00, G: 30.00 },
    imageUrl: '/pastelbanana.jpg'
  },

  // Adicionais
  {
    id: '15',
    categoryId: 'c3',
    name: 'Adicional: Queijo',
    description: 'Porção extra de queijo no seu pastel.',
    price: 6.00,
    imageUrl: '/pastelchedar.jpg'
  },
  {
    id: '16',
    categoryId: 'c3',
    name: 'Adicional: Ovo',
    description: 'Adicional de ovo no seu pastel.',
    price: 3.00,
    imageUrl: '/porçãopastel.webp'
  },
  {
    id: '17',
    categoryId: 'c3',
    name: 'Adicional: Orégano',
    description: 'Toque extra de orégano.',
    price: 1.00,
    imageUrl: '/maionesecaseira.jpg'
  },
  {
    id: '18',
    categoryId: 'c3',
    name: 'Adicional: Manjericão',
    description: 'Toque especial de manjericão fresco.',
    price: 2.00,
    imageUrl: '/maionesecaseira.jpg'
  },
  {
    id: '19',
    categoryId: 'c3',
    name: 'Adicional: Tomate',
    description: 'Adicional de tomate fresco picado.',
    price: 3.00,
    imageUrl: '/porçãopastel.webp'
  },
  {
    id: '20',
    categoryId: 'c3',
    name: 'Adicional: Tempero verde',
    description: 'Toque extra de tempero verde fresco.',
    price: 2.00,
    imageUrl: '/maionesecaseira.jpg'
  },
];

const INITIAL_SETTINGS: StoreSettings = {
  whatsappNumber: '5554984276299',
  menuVersion: CURRENT_MENU_VERSION
};

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    const seedInitialData = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
        const catSnapshot = await getDocs(collection(db, 'categories'));
        const currentVersion = settingsSnap.exists() ? settingsSnap.data()?.menuVersion : undefined;

        if (catSnapshot.empty || currentVersion !== CURRENT_MENU_VERSION) {
          const batch = writeBatch(db);

          // Remove old categories and products before seeding the new menu version
          const existingProds = await getDocs(collection(db, 'products'));
          existingProds.forEach(d => batch.delete(d.ref));
          catSnapshot.forEach(d => batch.delete(d.ref));

          INITIAL_CATEGORIES.forEach(cat => {
            batch.set(doc(collection(db, 'categories'), cat.id), cat);
          });
          INITIAL_PRODUCTS.forEach(prod => {
            batch.set(doc(collection(db, 'products'), prod.id), prod);
          });
          const existingWhatsapp = settingsSnap.exists() && settingsSnap.data()?.whatsappNumber
            ? settingsSnap.data().whatsappNumber
            : INITIAL_SETTINGS.whatsappNumber;
          batch.set(doc(db, 'settings', 'main'), {
            whatsappNumber: existingWhatsapp,
            menuVersion: CURRENT_MENU_VERSION
          });
          await batch.commit();
        }
      } catch (error) {
        console.error("Error seeding initial data:", error);
      }
    };
    
    seedInitialData();

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts: Product[] = [];
      snapshot.forEach(doc => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      if (snapshot.empty) {
        setProducts(INITIAL_PRODUCTS);
      } else {
        setProducts(fetchedProducts.sort((a, b) => Number(a.id) - Number(b.id)));
      }
    });

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const fetchedCategories: Category[] = [];
      snapshot.forEach(doc => {
        fetchedCategories.push({ id: doc.id, ...doc.data() } as Category);
      });
      if (snapshot.empty) {
        setCategories(INITIAL_CATEGORIES);
      } else {
        setCategories(fetchedCategories.sort((a, b) => a.id.localeCompare(b.id)));
      }
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as StoreSettings);
      } else {
        setSettings(INITIAL_SETTINGS);
      }
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSettings();
    };
  }, []);

  const addProduct = async (product: Product) => {
    try {
      if (!product.id) {
        product.id = doc(collection(db, 'products')).id;
      }
      await setDoc(doc(db, 'products', product.id), product);
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      await setDoc(doc(db, 'products', updatedProduct.id), updatedProduct);
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const updateSettings = async (newSettings: StoreSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'main'), newSettings);
    } catch (error) {
      console.error("Error updating settings", error);
    }
  };

  return {
    products,
    categories,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSettings
  };
}

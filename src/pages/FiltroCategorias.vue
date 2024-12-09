<template>
  <div>
    <h1>Produtos por Categoria</h1>
    
    <!-- Exibição das Tags (Categorias) -->
    <div class="tags">
      <span 
        v-for="category in categories" 
        :key="category" 
        class="tag" 
        :class="{ active: selectedCategory === category }" 
        @click="filterByCategory(category)"
      >
        {{ category }}
      </span>
      <span 
        class="tag" 
        :class="{ active: selectedCategory === '' }" 
        @click="filterByCategory('')"
      >
        Todos
      </span>
    </div>

    <!-- Lista de Produtos Filtrados -->
    <div class="products">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-item"
      >
        <h3>{{ product.name }}</h3>
        <p>Categoria: {{ product.category }}</p>
        <p>Preço: R$ {{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCategory: '', // Categoria selecionada (começa com 'Todos')
      categories: ['Tecnologia', 'Roupas', 'Brinquedos'], // Exemplos de categorias
      products: [
        { id: 1, name: 'Celular', category: 'Tecnologia', price: 1500 },
        { id: 2, name: 'Camiseta', category: 'Roupas', price: 50 },
        { id: 3, name: 'Boneca', category: 'Brinquedos', price: 80 },
        { id: 4, name: 'Laptop', category: 'Tecnologia', price: 3000 },
        { id: 5, name: 'Calça Jeans', category: 'Roupas', price: 120 },
      ],
    };
  },
  computed: {
    filteredProducts() {
      // Se não houver categoria selecionada, retorna todos os produtos
      if (this.selectedCategory) {
        return this.products.filter(product => product.category === this.selectedCategory);
      }
      return this.products; // Retorna todos os produtos se "Todos" for selecionado
    }
  },
  methods: {
    filterByCategory(category) {
      this.selectedCategory = category;
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.tags {
  margin-bottom: 20px;
}

.tag {
  display: inline-block;
  padding: 10px;
  margin: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.tag.active {
  background-color: #4caf50;
  color: white;
}

.products {
  display: flex;
  flex-wrap: wrap;
}

.product-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px;
  width: 200px;
  box-sizing: border-box;
}

.product-item h3 {
  margin: 0;
  font-size: 18px;
}

.product-item p {
  margin: 5px 0;
}
</style>

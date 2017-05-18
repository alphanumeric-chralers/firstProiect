<template>
  <div class="hello">
    <h2>Essential Links</h2>
    <div class="wrap">
      <vue-q-art :config="config"></vue-q-art>
    </div>
    <img class="pic-404__parent" src="../../assets/qr.png" alt="404">
  </div>
</template>

<script>
  import VueQArt from 'vue-qart'
  import QArt from 'qartjs';

export default {
  components: {
      VueQArt:VueQArt
    },
  name: 'hello',

  data () {
    return {
        config: {
            value: 'http://localhost:8080/login',
            imagePath: 'data:image/gif;base64,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',
            filter: 'color'
        },
    }
  },//data end

  methods:{
    components: { VueQArt }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrap {
  margin: 0 auto;
  width: 300px;
  height: 300px;
  border:1px solid red;
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

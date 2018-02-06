<template>
  <div>
    <h1>{{ msg }}</h1>

    <md-dialog-alert :md-active.sync="dialog.show"
                     :md-title="dialog.title"
                     :md-content="dialog.content"
                     md-confirm-text="Close"/>
    <div class="md-layout md-gutter md-alignment-top-center">
      <div class="md-layout-item md-size-25">
        <h2>Create Order</h2>
        <md-field>
          <label>Customer name</label>
          <md-input v-model="form.order.customerName"/>
        </md-field>
        <md-field>
          <label>Customer phone</label>
          <md-input v-model="form.order.customerPhone"/>
        </md-field>
        <md-field>
          <label>Currency</label>
          <md-input v-model="form.order.currency"/>
        </md-field>
        <md-field>
          <label>Price</label>
          <md-input v-model="form.order.price"/>
        </md-field>
        <md-field>
          <label>Creditcard holder name</label>
          <md-input v-model="form.payment.name"/>
        </md-field>
        <md-field>
          <label>Creditcard number</label>
          <md-input v-model="form.payment.number"/>
        </md-field>
        <md-field>
          <label>Creditcard expiration</label>
          <md-input v-model="form.payment.expiration"/>
        </md-field>
        <md-field>
          <label>Creditcard ccv</label>
          <md-input v-model="form.payment.ccv"/>
        </md-field>
        <md-button class="md-raised md-primary" @click="createOrder(form)">Sumbit</md-button>
      </div>

      <div class="md-layout-item md-size-25">
        <h2>Check Order</h2>
        <md-field>
          <label>Customer name</label>
          <md-input v-model="search.name"/>
        </md-field>
        <md-field>
          <label>Reference ID</label>
          <md-input v-model="search.refId"/>
        </md-field>
        <md-button class="md-raised md-primary" @click="findOrder(search)">Search</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from 'node-fetch'

export default {
  name: 'HelloWorld',
  async mounted () {

  },
  methods: {
    // ==== UI Functions ===============
    async createOrder (form) {
      let json = await this.createOrderApi(form)

      // Show success dialog
      this.dialog.title = 'Order created'
      this.dialog.content = `<div>Gateway: ${json.gateway}</div><div>RefId: ${json.refId}</div>`
      this.dialog.show = true
    },
    async findOrder (search) {
      let json = await this.findOrderApi(search)

      // Show sucess dialog
      this.dialog.title = 'Order detail'
      this.dialog.content = `
        <div>Customer Name: ${json.customerName}</div>
        <div>Customer Number: ${json.customerPhone}</div>
        <div>Currency: ${json.currency}</div>
        <div>Price: ${json.price}</div>`
      this.dialog.show = true
    },

    // ==== Api Functions ===============
    async createOrderApi (form) {
      try {
        let result = await fetch('/proxy/order/create', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        return await result.json()
      } catch (err) {
        // Show error dialog
        this.dialog.title = 'Error'
        this.dialog.content = err
        this.dialog.show = true
      }
    },
    async findOrderApi (search) {
      try {
        let result = await fetch(`/proxy/order/find?refId=${search.refId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        return await result.json()
      } catch (err) {
        // Show error dialog
        this.dialog.title = 'Error'
        this.dialog.content = err
        this.dialog.show = true
      }
    }
  },
  data () {
    return {
      msg: 'Welcome to this demo!',
      form: {
        order: {
          customerName: 'Test Mak',
          customerPhone: '88888888',
          currency: 'HKD',
          price: 100.1
        },
        payment: {
          name: 'Test Mak',
          number: '378282246310005',
          expiration: '2000/01',
          ccv: '123'
        }
      },
      search: {
        name: 'Test Mak',
        refId: ''
      },
      dialog: {
        title: 'Dialog Title',
        content: '<p>content</p>',
        show: false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

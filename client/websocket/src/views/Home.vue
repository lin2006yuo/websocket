<template>
  <div class="home">
    <div class="identity">
      <span>选择身份：</span>
        <ul>
          <li :class="{select: item.name === name.name}" class="people" @click="setName(item.id)" v-for="(item) in chatPeople" :key="item.id">{{item.name}}</li>
        </ul>
    </div>
    <div class="chatroom">
      <div class="left">
        <ul>
          <li :class="{sayto: item.name === sayToName.name}" class="people" @click="sayTo(item.id)" v-for="(item) in chatPeople" :key="item.id">{{item.name}}</li>
        </ul>
      </div>
      <div class="right">
        <div class="chat">
          <div class="chat-zoom">
            <div class="chat" :class="{'me': item.id === name.id}" v-for="(item, index) in chatRecord" :key="index">{{item.name}}：{{item.msg}}</div>
          </div>    
          <div class="chat-put">
            <textarea @keyup.enter="submit" v-model="text" class="textarea" name="" id=""></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import ws from 'socket.io-client'

export default {
  name: 'home',
  data() {
    return {
      name: '',
      sayToName: '',
      ws: '',
      chatRecord: [],
      chatPeople: [{ id: 151, name: 'Ben' }, { id: 152, name: 'Linda' }, { id: 153, name: 'Curry' }],
      text: '',
    }
  },
  mounted() {
    this.ws = new ws('ws://localhost:3000')
    const socket = this.ws
    socket.on('connect', () => {
      socket.on('message', (msg) => {
        this.chatRecord.push(msg)
      })
    })
  },
  methods: {
    setName(id) {
      this.name = this.chatPeople.find(c => c.id === id)
      this.ws.emit('setName', this.name.id)
    },
    sayTo(id) {
      this.sayToName = this.chatPeople.find(c => c.id === id)
    },
    submit(e) {
      e.preventDefault();
      const text = this.text.replace(/[\r\n]/g, "")
      const msg = { me: this.name.id ,id: this.sayToName.id, msg: text }
      this.ws.emit('sayTo', msg)
      this.text = ""
    }
  }
}
</script>

<style lang="stylus" scoped>
.identity {
  display flex
  justify-content center
  ul {
    display flex
    margin-bottom 20px
    li {
      margin 0 10px
      cursor pointer
      &.select {
        background-color skyblue
      }
    }
  }
}
.chatroom {
  display flex
  justify-content center
  .people {
    margin-top 20px
    margin-right 10px
    cursor pointer
    &.sayto {
      background-color orange
    }
  }
}
.right {
  .chat {
    .chat-zoom {
      width 400px
      height 400px
      border 1px solid #333
      text-align right 
      .chat {
        text-align left 
        &.me {
          text-align right 
        }
      }
    }
    .chat-put {
      width 400px
      height 100px
      margin-top 20px
      padding 4px
      box-sizing border-box
      border 1px solid #333
      .textarea {
        width 100%
        height 100%
        padding 0
        border none
        outline none
        resize none
      }
    }
  }
}
</style>


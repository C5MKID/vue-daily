<template>
  <div class="daily">
    <div class="daily-menu">
      <div class="daily-menu-item"
          :class="{ on: type === 'recommend' }"
          @click="handleToRecommend">每日推荐</div>
      <div class="daily-menu-item"
          :class="{ on: type === 'daily' }"
          @click="showThemes = !showThemes">主题日报</div>
      <ul v-show="showThemes">
        <li v-for="item in themes">
          <a href="javascript:;"
            :class="{ on: item.id === themeId && type === 'daily' }"
            @click="handleToTheme(item.id)">{{ item.name }}</a>
        </li>
      </ul>
    </div>
    <div
      class="daily-list"
      ref="list"
      @scroll="handleScroll">
      <template v-if="type === 'recommend'">
        <div v-for="list in recommendList">
          <div class="daily-title">{{ formatDay(list.date) }}</div>
          <Item
            v-for="item in list.stories"
            :data="item"
            :key="item.id"
            @click.native="handleClick(item.id)"></Item>
        </div>
      </template>
      <template v-if="type === 'daily'">
        <Item
          v-for="item in list"
          :data="item"
          :key="item.id"
          @click.native="handleClick(item.id)"></Item>
      </template>
    </div>
    <daily-article :id="articleId"></daily-article>
  </div>
</template>

<script>
import $ from './libs/util';
import Item from './components/item.vue';
import dailyArticle from './components/daily-article.vue';

export default {
  components: { Item, dailyArticle },
  data () {
    return {
      themes: [],
      recommendList: [],
      list: [],
      dailyTime: $.getTodayTime(),
      showThemes: false,
      isLoading: false,
      type: 'recommend',
      themeId: 0,
      articleId: 0
    }
  },
  methods: {
    getThemes () {
      $.ajax.get('themes').then(res => {
        this.themes = res.others;
      })
    },
    handleToRecommend () {
      this.type = 'recommend',
      this.recommendList = [];
      this.dailyTime = $.getTodayTime();
      this.getRecommendList();
    },
    getRecommendList () {
      this.isLoading = true;
      const prevDay = $.prevDay( this.dailyTime + 86400000 );
      $.ajax.get('news/before/' + prevDay).then(res => {
        this.recommendList.push(res);
        this.isLoading = false;
      })
    },
    handleToTheme (id) {
      this.type = 'daily';
      this.themeId = id;
      this.list = [];
      $.ajax.get('theme/'+id).then( res => {
        this.list = res.stories
          .filter(item => item.type !== 1);
      });
    },
    formatDay (date) {
      let month = date.substr(4,2) * 1;
      let day = date.substr(6,2) * 1;
      return `${month}月${day}日`;
    },
    handleClick (id) {
      this.articleId = id;
    },
    handleScroll () {
      const $list = this.$refs.list;
      let scrollT = $list.scrollTop;
      let clientH = document.body.clientHeight;
      let scrollH = $list.scrollHeight;
      if( this.type === 'daily' || this.isLoading )return;
      if( scrollT + clientH >= scrollH ){
        this.dailyTime -= 86400000;
        this.getRecommendList();
      }
    }
  },
  mounted () {
    this.getThemes();
    this.getRecommendList();
  }
}
</script>

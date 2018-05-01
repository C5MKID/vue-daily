<template lang="html">
  <div class="daily-article">
    <div class="daily-article-title">{{ data.title }}</div>
    <div class="daily-article-content" v-html="data.body"></div>
    <div class="daily-comments" v-if="comments.length">
      <span>评论（{{ comments.length }}）</span>
      <div class="daily-comment" v-for="comment in comments">
        <div class="daily-comment-avatar">
          <img :src="comment.avatar" alt="">
        </div>
        <div class="daily-comment-content">
          <div class="daily-comment-name">{{ comment.name }}</div>
          <div class="daily-comment-time" v-time="comment.time"></div>
          <div class="daily-comment-text">{{ comment.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from '../libs/util';
import Time from '../directives/time';

export default {
  directives: { Time },
  props: {
      id: {
        type: Number,
        default: 0
      }
  },
  data () {
    return {
      data: {},
      comments: []
    }
  },
  methods: {
    getArticle () {
      $.ajax.get('news/'+ this.id).then(res => {
        res.body = res.body
          .replace(/src="(http|https)/g, 'src="' + $.imgPath + '$1' );
        this.data = res;
        window.scrollTo(0,0);
        this.getComments();
      });
    },
    getComments () {
      this.comments = [];
      $.ajax.get('story/'+ this.id +'/short-comments').then(res => {
        this.comments = res.comments.map( comment => {
            comment.avatar = $.imgPath + comment.avatar;
            return comment;
        })
      });
    }
  },
  watch: {
    id (val) {
      if (val) this.getArticle();
    }
  }
}
</script>

<style lang="css">
</style>

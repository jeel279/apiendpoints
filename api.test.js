process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();
let jwtToken = ""
let db = require('./db')

chai.use(chaiHttp);
//Our parent block

describe('dbconn and cleaning procedure',()=>{
    it('dbconnection-check and clearing databases',async(done)=>{
        try{
            const a = db(`TRUNCATE TABLE "comments","posts";`)
            done()
        }catch(err){
            throw err;
        }
    })
})

describe('authentication', () => {
    
/*
  * Test the /GET route
  */
  describe('/authenticate user', () => {


  it('it should authenticate user and throw error for wrong credentials', (done) => {
    chai.request(server)
        .post('/api/authenticate')
        .send({
            email : 'johndoe@mail.com',
            password : 'qazxsQ'
        })
        .end((err, res) => {
              res.should.have.status(401);
            //   res.body.should.be.a('object');
            done();
            });
        });
    });

      it('it should authenticate user and send jwt token in response', (done) => {
        chai.request(server)
            .post('/api/authenticate')
            .send({
                email : 'johndoe@mail.com',
                password : 'qazxsw'
            })
            .end((err, res) => {
                  jwtToken = res.body.token;
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });


});


// describe("user-actions: follow-unfollow",()=>{
//     describe("/follow/:id 'it should follow a user with given user_id'",()=>{
//         it(`it should not follow a user without authentication-token`,(done)=>{
//             chai.request(server)
//                 .post(`/api/follow/2`)
//                 .end((err,res)=>{
//                     res.should.have.status(403)
//                     done()
//                 })
//         })
//         it(`it should not follow a user with wrong authentication-token`,(done)=>{
//             chai.request(server)
//                 .post(`/api/follow/2`)
//                 .send({token : 'asdasdasd'})
//                 .end((err,res)=>{
//                     res.should.have.status(401)
//                     done()
//                 })
//         })
//         it(`it should follow a user with given user_id: 2 if exists with auth`,(done)=>{
//             chai.request(server)
//                 .post(`/api/follow/2`)
//                 .send({token : jwtToken})
//                 .end((err,res)=>{
//                     res.should.have.status(200)
//                     done()
//                 })
//         })
//         for(let i=1,nm=parseInt(i*(i+1)*100*Math.random());i<=5;i++,nm=parseInt(i*(i+1)*100*Math.random())){
//             it(`it should follow a user with given user_id: ${nm} if exists`,(done)=>{
//                 chai.request(server)
//                     .post(`/api/follow/${nm}`)
//                     .send({token : jwtToken})
//                     .end((err,res)=>{
//                         res.should.have.status(404)
//                         done()
//                     })
//             })
//         }
//     })


//     describe("/unfollow/:id 'it should unfollow a user with given user_id'",()=>{
//         it(`it should not unfollow a user without authentication-token`,(done)=>{
//             chai.request(server)
//                 .post(`/api/unfollow/2`)
//                 .end((err,res)=>{
//                     res.should.have.status(403)
//                     done()
//                 })
//         })
//         it(`it should not unfollow a user with wrong authentication-token`,(done)=>{
//             chai.request(server)
//                 .post(`/api/unfollow/2`)
//                 .send({token : 'asdasdasd'})
//                 .end((err,res)=>{
//                     res.should.have.status(401)
//                     done()
//                 })
//         })
//         it(`it should unfollow a user with given user_id: 2 if exists with auth`,(done)=>{
//             chai.request(server)
//                 .post(`/api/unfollow/2`)
//                 .send({token : jwtToken})
//                 .end((err,res)=>{
//                     res.should.have.status(200)
//                     done()
//                 })
//         })
//         for(var i=1,nm=parseInt(i*(i+1)*107*Math.random());i<=5;i++,nm=parseInt(i*(i+1)*100*Math.random())){
//             it(`it should unfollow a user with given user_id: ${nm} if exists`,(done)=>{
//                 chai.request(server)
//                     .post(`/api/unfollow/${nm}`)
//                     .send({token : jwtToken})
//                     .end((err,res)=>{
//                         res.should.have.status(404)
//                         done()
//                     })
//             })
//         }
//     })
// })

describe("user-data",()=>{
    it('it should return 403 for user data request without auth',(done)=>{
        chai.request(server)
            .get('/api/user')
            .end((err,res)=>{
                res.should.have.status(403)
                done()
            })
    })
    it('it should return 401 for user data request with wrong auth',(done)=>{
        chai.request(server)
            .get('/api/user')
            .send({token : 'adssadsd'})
            .end((err,res)=>{
                res.should.have.status(401)
                done()
            })
    })
    it('it should return userdata for user data request with auth',(done)=>{
        chai.request(server)
            .get('/api/user')
            .send({token:jwtToken})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
            })
    })
})


var post_id_g = -1
describe("new-post@ POST /api/posts",()=>{
    it('it should not post new post without auth',(done)=>{
        chai.request(server)
            .post('/api/posts')
            .send({title:`sample`,description:'New Post'})
            .end((err,res)=>{
                res.should.have.status(403)
                done()
            })
    })
    it('it should not post new post with wrong auth',(done)=>{
        chai.request(server)
            .post('/api/posts')
            .send({title:`new '${new Date().getTime()}'`,description:'New Post',token:'asdasdds'})
            .end((err,res)=>{
                res.should.have.status(401)
                done()
            })
    })
    it('it should not post new post with empty or null title',(done)=>{
        chai.request(server)
            .post('/api/posts')
            .send({title:'',description:'New Post',token:jwtToken})
            .end((err,res)=>{
                res.should.have.status(400)
                done()
            })
    })
    it('it should post new post with valid title',(done)=>{
        chai.request(server)
            .post('/api/posts')
            .send({title:`sample`,description:'New Post',token:jwtToken})
            .end((err,res)=>{
                res.should.have.status(200)
                post_id_g = res.body.id;
                res.body.should.be.a('object')
                // console.log(post_id)
                done()
                    
            })
    })

})

describe("delete-post@ DELETE /api/posts/:id",async()=>{
    var post_id = '';
    // await chai.request(server)
    //     .post('/api/posts')
    //     .send({'title':'A','description':'B',token : jwtToken})
    //     .end((err,res)=>{
    //         post_id = res.body.id;
    //     })
        it(`it should not delete post with given id without auth`,(done)=>{
            chai.request(server)
                .delete(`/api/posts/${post_id}`)
                .end((err,res)=>{
                    res.should.have.status(404)
                    done()
                })
        })
    
        it(`it should not delete post with given with wrong auth`,(done)=>{
            chai.request(server)
                .delete(`/api/posts/65`)
                .send({token:'dasdasd'})
                .end((err,res)=>{
                    res.should.have.status(401)
                    done()
                })
        })
    
        it(`it should delete post with given id with valid auth`,(done)=>{
            chai.request(server)
                .post('/api/posts')
                .send({'title':'A','description':'B',token : jwtToken})
                .end((erra,resa)=>{
                    post_id = resa.body.id;
                    chai.request(server)
                        .delete(`/api/posts/${post_id}`)
                        .send({token:jwtToken})
                        .end((err,res)=>{
                            res.should.have.status(200)
                            done()
                    })
                })
            
        })
})

describe("like-unlike-comment-post_details",()=>{
    var post_id = ''
    it('it should like post by authenticated user',(done)=>{
        chai.request(server)
                .post('/api/posts')
                .send({'title':'A','description':'B',token : jwtToken})
                .end((erra,resa)=>{
                    post_id = resa.body.id
                    chai.request(server)
                        .post(`/api/like/${post_id}`)
                        .send({token : jwtToken})
                        .end((err,res)=>{
                            res.should.have.status(200)
                            done()
                        })
                })
    })
    it('it should unlike post by authenticated user',(done)=>{
        
                    chai.request(server)
                        .post(`/api/unlike/${post_id}`)
                        .send({token : jwtToken})
                        .end((err,res)=>{
                            res.should.have.status(200)
                            done()
                        })
            
    })
    it('it should post a comment on a post by authenticated user',(done)=>{
        
        chai.request(server)
            .post(`/api/comment/${post_id}`)
            .send({token : jwtToken,comment:'New Comment'})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
            })

    })

    it('it should fetch post details by given id',(done)=>{
        chai.request(server)
            .get(`/api/posts/${post_id}`)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
            })
    })

})

describe('fetch all posts by user',()=>{
    it('it should fetch all posts posted by auth-ed user',(done)=>{
        chai.request(server)
            .get(`/api/all_posts`)
            .send({token:jwtToken})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.should.be.a('array')
                done()
            })
    })
})

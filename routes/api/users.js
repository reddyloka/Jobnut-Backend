var mongoose = require('mongoose');
var router = require('express').Router();
var Hr = mongoose.model('hrModel');
var Applicant = mongoose.model('applicantModel');
var auth = require('../auth');
var Post = mongoose.model('postModel');
var notifyFunctions = require('./notify');


router.get('/hrs', async (req, res, next) => {
    console.log('data from hr')
  try{
      console.log('data from hr',req.query.id)
    const user = await Hr.findById(req.query.id)
    if(!user){
        return res.status(401).json({
            success:false,
            errors:{
                message:'User Doesn\'t Exist !'
            }
        })
    }
    return res.json(user);
  } catch(e){
      console.log("data from the hr details",e);
  }
 
});

router.put('/hrs/update', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Hr.findByIdAndUpdate(req.query.id, req.body)
    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });

 router.put('/users/apply', async (req, res) => {
    
    const data = Post.findById(req.query.id).then((post)=>{
        newRequest={
            _id: req.query.hrRef
           }
     post.applicants.push(newRequest)
     post.save();
    })
    // notifyFunctions.jobNotification(req.query.hrRef);
    if(data){
        console.log('success')
    return res.json(data);
    }else{
        console.log('fail')
    }
 });

 router.get('/users/appliedposts', async (req, res) => {
    const data = await Post.find({'applicants._id': req.query.id})
    if(!data){
     console.log('main',data)
    }
    console.log('main',data)
    return res.json(data);
 });


 router.put('/hrs/expUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Hr.findById(req.query.id).then((user)=> {
        user.experience.push(req.body);
        user.save()
    })
    // data.save()
    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });


router.put('/users/update', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Applicant.findByIdAndUpdate(req.query.id, req.body)
    if(!data){
        console.log('fail')
    }
    return res.json(
        {
            data: data
        }
    )
 });

 router.put('/users/eduUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Applicant.findById(req.query.id).then((user)=> {
        user.education.push(req.body);
        user.save()
    })
    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });

 router.put('/users/expUpdate', async (req, res, next) => {
    console.log("upadted AAAAAAAAAAA",req.query.id)
    const data = await Applicant.findById(req.query.id).then((user)=> {
        user.experience.push(req.body);
        user.save()
    })
    // data.save()
    if(!data){
        // eror
    }
    return res.json(
        {
            data: data
        }
    )
 });


router.get('/users', (req, res, next) => {
   console.log(req.query.id);
    // if (user_details.isHr && user_details.status) {
    Applicant.findById(req.query.id).then((user) => {
        if (!user){
            return res.sendStatus(401);
        }
        return res.json(user);
    }).catch(next);
    
    // }


    
});



router.post('/login', async (req, res, next) => {

    user_details = JSON.parse(JSON.stringify(req.body));
    console.log('user login details', user_details);
    if (!req.body.username) {
        return res.status(422).json({
            success: false,
            errors: {
                email: 'can\'t be blank'
            }
        })
    }

    if (!req.body.password) {
        return res.status(422).json({
            success: false,
            errors: {
                password: 'can\'t be blank'
            }
        })
    }
    if (user_details.isHr) {
        const user=await Hr.findOne({email: user_details.username});
        if(user){
            user.decryptPassword(user_details.password).then((user1)=>{
                console.log('HR password match status',user1);
            if (!user1) {
                return res.status(401).json({
                    success: false,
                    errors: {
                        message: 'Password Incorrect??'
                    }
                });
            }
            return res.json({
                user: user.toAuthJSON()
            });
        })
    } else{
        return res.status(401).json({
            success: false,
            errors: {
                message: 'Signup first'
            }
        });
    }

    } else {
        const user=await Applicant.findOne({email: user_details.username});
           if(user){
            user.decryptPassword(user_details.password).then((user1)=>{
                    console.log('Applicant password match status',user1);
                if (!user1) {
                    return res.status(401).json({
                        success: false,
                        errors: {
                            message: 'Password Incorrect??'
                        }
                    });
                }
                return res.json({
                    user: user.toAuthJSON()
                });
            })
        }else{
            return res.status(401).json({
                success: false,
                errors: {
                    message: 'Signup first'
                }
            });
        }
    }
});

router.get('/user', (req, res, next) => {
    user_details = JSON.parse(JSON.stringify(req.body));
    if (user_details.isHr && user_details.status) {
        Applicant.find().then((user) => {
            if (!user) {
                return res.sendStatus(401);
            }
            return res.json({
                user: user
            });
        }).catch(next);
    }
});

// function no_such_post() {
//     return make_error("no_such_post",
//         "The specified post does not exist");
// }

// function make_error(err, msg) {
//     var e = new Error(msg);
//     e.code = err;
//     return e;
// }

// failure and success

// function send_success(res, data) {
//     res.writeHead(200, {
//         "Content-Type": "application/json"
//     });
//     var output = {
//         error: null,
//         data: data
//     };
//     res.end(JSON.stringify(output) + "\n");
// }

// function send_failure(res, server_code, err) {
//     var code = (err.code) ? err.code : err.name;
//     res.writeHead(server_code, {
//         "Content-Type": "application/json"
//     });
//     res.end(JSON.stringify({
//         error: code,
//         message: err.message
//     }) + "\n");
// }
// failure and success

router.post('/resetPassword',async (req,res)=>{
    const user_details = JSON.parse(JSON.stringify(req.body));
    console.log('reset userdetails',user_details);
    if(user_details.isHr){
        let data=await Hr.findOne({email:user_details.email});
        let hr = new Hr(data);
        hr.encryptPassword(user_details.password);
        hr.save().then((data) => {
           console.log('hr updated',data);
           return res.json({
               data: data
           });
        });
    }
    else 
    { 
     let data=await Applicant.findOne({email:user_details.email});
     let applicant = new Applicant(data);
     applicant.encryptPassword(user_details.password);
     applicant.save().then((data) => {
        console.log(' applicant updated',data);
        return res.json({
            data: data
        });
     });
    }
})

router.post('/checkMailId',async (req,res)=>{
    const user_details = JSON.parse(JSON.stringify(req.body));
    if(!user_details.isHr){
    let data=await Applicant.findOne({email:user_details.email});
    console.log(' applicant data',data);
      if(data){
        return res.json({
            data: data,
            status:true
        });
    }else{
        return res.json({
            status:false
        });
    }
}
else if(user_details.isHr){
    let data=await Hr.findOne({email:user_details.email});
    console.log(' hr data',data);
      if(data){
        return res.json({
            data: data,
            status:true
        });
    }else{
        return res.json({
            status:false
        });
    }
}
})

router.post('/hr', (req, res) => {
    // res.cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});
    // console.log('chello', req.body);
    if (req.body.isApplicant) {
        const user_details = JSON.parse(JSON.stringify(req.body))
        let applicant = new Applicant(user_details);
        applicant.encryptPassword(user_details.password);
        applicant.save().then(() => {
            return res.json({
                applicant: applicant.toProfileJSONFor()
            });
        }).catch(err => {
            console.log(err);  
        });
        console.log('user mail',user_details.email);
        notifyFunctions.signupNotification(user_details.email);

    } else if (req.body.isHr) {
        console.log('hr data', req.body);
        const user_details = JSON.parse(JSON.stringify(req.body))
        let hr = new Hr(user_details);
        hr.encryptPassword(user_details.password);
        hr.save().then((data) => {
            console.log('new data ', data);
            return send_success(res, hr.toProfileJSONFor(), 'hr Created!');
        }).catch(err => {
            console.log(err);
            
        });
        console.log('hr mail',user_details.email);
        notifyFunctions.signupNotification(user_details.email);
    }
});

router.put('/v1/hr', (req, res) => {
    var user_details_to_add = JSON.parse(JSON.stringify(req.body));
    console.log(user_details_to_add);

    if (user_details_to_add.isApplicant) {
        applicantModel.findOne({
            email: user_details_to_add.email
        }, (err, reply) => {
            if (!err, reply) {
                console.log('user exist!');
                return false
            }
            // next();
        })
        applicantModelObj = new applicantModel(user_details_to_add);
        addNewUser(applicantModelObj);
    } else if (user_details_to_add.isHr) {
        hrModel.findOne({
            email: user_details_to_add.email
        }, (err, reply) => {
            if (!err, reply) {
                console.log('user exist!');
                return false
            }
            // next();
        })
        hrModelObj = new hrModel(user_details_to_add);
        addNewUser(hrModelObj);
    } else {
        console.log(new Error('Nothing in: ', user_details_to_add));
    }
    // console.log(jobModelObj);

})

router.get('/v1/posts', (req, res) => {
    postModel.find((err, result) => {
        send_success(res, result);
    })
})

router.get('/v1/posts/:post_id', (req, res) => {
    var post_id = req.params.post_id;
    // console.log(' ❌ ', req.params.post_id);

    postModel.findOne({
        _id: post_id
    }, (err, result) => {
        if (err) {
            send_failure(res, 404, no_such_post());
        }
        console.log(' ❌ ', result);
        send_success(res, result);
        // return;
    })
})

router.put('/posts', (req, res) => {
    var post_details_to_add = JSON.parse(JSON.stringify(req.body));
    postModelObj = new postModel(post_details_to_add);
    addNewPost(postModelObj);
    // send_success(res, resu)
})

function addNewPost(postObj) {
    console.log(' 💤 ', postObj);
    postObj.save()
        .then(() => {
            console.log(true);
            console.log('database saved!');
        }).catch((err) => {
            console.log('error detected');
        })

}

module.exports = router;
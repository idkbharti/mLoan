const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Customer = require('../models/user');
const Loan = require('../models/loan');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .createHmac('sha256', salt)
      .update(password)
      .digest('hex');

    const customer = new Customer({
      firstName,
      lastName,
      email,
      password: hash, 
      salt,
    });

    await customer.save();
    res.status(201).json({ message: 'Signup successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/login', async (req, res) => {
    try {
      // const key="SECRET"
      const { email, password } = req.body;
      const customer = await Customer.findOne({ email });
  
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      const hash = crypto
        .createHmac('sha256', customer.salt)
        .update(password)
        .digest('hex');
  
      if (hash === customer.password) {
        // const token = jwt.sign(
        //   { customerId: customer._id, email: customer.email },
        //   key, 
        //   { expiresIn: '1h' } 
        // );
  
        res.status(200).json({ message: 'Login successful', userInfo:{email:customer.email,name:customer.firstName,id:customer._id }});
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.post('/request-loan', async (req, res) => {
    try {
      const { email, amount, tenureInWeeks, panCard } = req.body;
      const customer = await Customer.findOne({ email });
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      const loan = new Loan({
        customer: customer._id, 
        amount,
        tenureInWeeks,
        panCard,
        status: 'APPROVED', 
        completedTenure:0
      });
      await loan.save();
  
      res.status(201).json({ message: 'Loan request submitted successfully' ,
      loanDetails:{status:loan.status,
        id:loan._id,
        completedTenure:loan.completedTenure,
      }});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/loans/:uid', async (req, res) => {
    try {
      const uid = req.params.uid;
      // console.log(uid)
  
      const loans = await Loan.find({ customer:uid });
      console.log(loans)
  
      res.status(200).json(loans);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.put('/update-loan/:loanId', async (req, res) => {
    try {
      const { loanId } = req.params;
      const { status, lastPayment,userAction,completedTenure } = req.body;
      const loan = await Loan.findById(loanId);
  
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
  
      if (status) {
        loan.status = status;
      }
      if (lastPayment) {
        loan.paymentInfo = lastPayment;
      }
      if (userAction) {
        loan.userAction = userAction;
      }
      if (completedTenure) {
        loan.completedTenure = completedTenure;
      }
      if (lastPayment) {
        loan.lastPayment = lastPayment;
      }
  
      await loan.save();
  
      res.status(200).json({ message: 'Loan details updated successfully', loan });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.delete('/loan/:id', async (req, res) => {
    try {
      const loanId = req.params.id;
      const deletedLoan = await Loan.findByIdAndRemove(loanId);
  
      if (!deletedLoan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
  
      res.status(201).json({ message: 'Loan deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/loan/:id', async (req, res) => {
    try {
      const loanId = req.params.id;
      // console.log(loanId)
      const loan = await Loan.findById(loanId);
  
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
  
      res.json(loan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get("/"),

  module.exports=router;
import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['id','uuid','fname','lname','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['id','uuid','fname','lname','email','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getMeById = async(req, res) =>{
    console.log("Requested UUID:", req.params.id);
    try {
        const response = await User.findOne({
            attributes:['uuid','fname','lname','email'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createUser = async(req, res) =>{
    const {fname, lname, email, password, confPassword, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "รหัสผ่านไม่ตรงกัน !"});
    // ตรวจสอบว่ามีอีเมลนี้ในฐานข้อมูลหรือไม่
    const existingUserByEmail = await User.findOne({
        where: {
            email: email
        }
    });
    if(existingUserByEmail) return res.status(400).json({msg: "อีเมลนี้มีอยู่ในระบบแล้ว !"});

    // ตรวจสอบว่ามีชื่อนี้ในฐานข้อมูลหรือไม่
    const existingUserByName = await User.findOne({
        where: {
            fname: fname
        }
    });
    if(existingUserByName) return res.status(400).json({msg: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว !"});

    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            fname: fname,
            lname: lname,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "สร้างผู้ใช้เรียบร้อยแล้ว !"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const updateUser = async(req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "ไม่พบผู้ใช้ !" });

    const { fname, lname, email, password, confPassword, role } = req.body;
    let updateFields = {};

    if (email && email !== user.email) {
        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) return res.status(400).json({ msg: "อีเมลนี้มีอยู่ในระบบแล้ว !" });
        updateFields.email = email;
    }

    if (fname && fname !== user.fname) {
        const existingUserByName = await User.findOne({ where: { fname } });
        if (existingUserByName) return res.status(400).json({ msg: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว !" });
        updateFields.fname = fname;
    }

    if (password) {
        if (password !== confPassword) return res.status(400).json({ msg: "รหัสผ่านไม่ตรงกัน !" });
        updateFields.password = await argon2.hash(password);
    }

    if (role) updateFields.role = role;

    try {
        await User.update(updateFields, {
            where: {
                uuid: req.params.id
            }
        });
        return res.json({ msg: "ทำการอัพเดทผู้ใช้เรียบร้อยแล้ว !" });
    } catch (error) {
        return res.status(500).json({ msg: "มีข้อผิดพลาดขณะทำการอัพเดท !" });
    }
};

export const editProfile = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "ไม่พบผู้ใข้ !" });

    const { fname, email, password, confPassword } = req.body;
    let updateFields = {};

    if (email && email !== user.email) {
        const existingUserByEmail = await User.findOne({ where: { email } });
        if (existingUserByEmail) return res.status(400).json({ msg: "อีเมลนี้มีอยู่ในระบบแล้ว !" });
        updateFields.email = email;
    }

    if (fname && fname !== user.fname) {
        const existingUserByName = await User.findOne({ where: { fname } });
        if (existingUserByName) return res.status(400).json({ msg: "ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว !" });
        updateFields.fname = fname;
    }

    if (password) {
        if (password !== confPassword) return res.status(400).json({ msg: "รหัสผ่านไม่ตรงกัน !" });
        updateFields.password = await argon2.hash(password);
    }

    try {
        await User.update(updateFields, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "อัปเดตโปรไฟล์สำเร็จ !" });
    } catch (error) {
        res.status(500).json({ msg: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์ !" });
    }
};

export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "ไม่พบผู้ใช้ !"});
    try {
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "ลบผู้ใช้เรียบร้อยแล้ว !"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
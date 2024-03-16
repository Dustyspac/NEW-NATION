import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SelectCustom from "./SelectCustom";
import request from "../../APIS/Axios/api";

function AddNewsForm() {
  const navigate = useNavigate();

  // 카테고리 셀렉트 옵션들
  const options = [
    { value: "SOCIETY", label: "사회" },
    { value: "ENVIRONMENT", label: "환경" },
    { value: "TECH", label: "테크" },
    { value: "ETC", label: "기타" },
  ];

  const [imgFile, setImgFile] = useState("");
  const [newsData, setNewsData] = useState({
    title: "",
    category: { value: "ETC", label: "기타" },
    imgUrl: "",
    content: "",
  });

  const handleImg = async (e) => {
    // e.preventDefault();
    let file = e.target.files[0];
    console.log("file", file);
    setImgFile(file.name);

    const formData = new FormData();
    formData.append("img", file); //이름 문제였음

    console.log("formData", formData);
    // image post
    try {
      const response = await request.post(`/api/article/img`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        // alert("성공적");
        setNewsData({ ...newsData, imgUrl: response.data.imgUrl }); //data.imgUrl 추가 안 함
        // console.log("response.data.imgUrl", response.data.imgUrl);
      }
      console.log("response", response);
    } catch (error) {
      console.log("에러발생", error);
    }
  };

  // 초기화 함수
  const initFunc = () => {
    setNewsData({
      title: "",
      category: { value: "ETC", label: "기타" },
      imgUrl: "",
      content: "",
    });
  };

  const handleNavigateClick = () => {
    navigate("/");
  };

  // 전체 내용 post
  const handleSubmitClick = async () => {
    // if (title === "" || content === "" || img === "") {
    //   alert("제목, 내용, 이미지 URL을 모두 입력해주세요.");
    //   return;
    // }
    try {
      const newPost = {
        title: newsData.title,
        imgUrl: newsData.imgUrl,
        category: newsData.category.value,
        content: newsData.content,
      };
      const response = await request.post(`/api/article`, newPost, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        alert("성공적");
        initFunc();
      }
      console.log("response", response);
      navigate("/");
    } catch (error) {
      console.log("전체요청 에러발생", error);
    }
  };
  const handleSelectChange = (selectedOption) => {
    const selectedCategory = options.find(
      (option) => option.value === selectedOption.value
    );
    setNewsData({ ...newsData, category: selectedCategory });
  };

  return (
    <Container>
      <InputBox>
        <Input
          type="text"
          value={newsData.title}
          onChange={(e) => setNewsData({ ...newsData, title: e.target.value })}
          placeholder="제목을 입력하세요"
        />
        <SelectCustom
          options={options}
          category={newsData.category}
          onChange={handleSelectChange}
        />
        {/* <form
          action="/home/uploadfiles"
          method="post"
          enctype="multipart/form-data"
        > */}
        <Label htmlFor="imgFile">
          {imgFile ? imgFile : "이미지를 선택해주세요"}
        </Label>
        <InputFile id="imgFile" type="file" onChange={(e) => handleImg(e)} />
        {/* </form> */}
        <Textarea
          type="text"
          value={newsData.content}
          onChange={(e) =>
            setNewsData({ ...newsData, content: e.target.value })
          }
          placeholder="내용을 입력하세요"
        />
      </InputBox>
      <BtnContainer>
        <Btn onClick={handleNavigateClick}>나가기</Btn>
        <Btn onClick={handleSubmitClick}>업로드</Btn>
      </BtnContainer>
    </Container>
  );
}

export default AddNewsForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 80px;
`;

const InputBox = styled.div`
  margin: 18px 0 30px 0;
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input`
  height: 54px;
  margin-top: 17px;
  padding-left: 12px;
`;

const Label = styled.label`
  height: 54px;
  margin-top: 17px;
  padding-left: 12px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;
const InputFile = styled.input`
  display: none;
`;

const Textarea = styled.textarea`
  height: 240px;
  font-size: 14px;
  margin-top: 17px;
  padding: 12px;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
`;

const Btn = styled.button`
  width: 320px;
  height: 60px;
  color: white;
  background-color: #141414;
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  font-size: 18px;

  &:hover {
    background-color: #8a8a8a;
  }
`;

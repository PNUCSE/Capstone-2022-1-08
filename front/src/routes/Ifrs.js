import { useRecoilValue } from "recoil";
import { stockCode } from "./Info";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from 'axios';
import {Container,Header} from "./Article"
import { useQuery } from "react-query";
const Td = styled.td`
    text-align:right;
    padding:5px;
    border-bottom:1px solid #E6E9ED;
    color: #73879C;
`
const Th = styled.th`
    font-weight:600;
    color:#73879C;
    font-size:15px;
    text-align:right;
    padding:5px;
`
// 재무제표
function Ifrs(){
    const code = useRecoilValue(stockCode);
    const fetchIfrs = () => {
        return axios.get(`/api/ifrs/${code}`);
    }
    const {data,isLoading} = useQuery('ifrs',fetchIfrs);
    return (
        <Container>
            <Header>
                재무제표 Net Quarter (단위: 억원)
            </Header>
            <table>
                <thead>
                <tr>
                    <Th></Th>
                    <Th>2019/12</Th>
                    <Th>2020/12</Th>
                    <Th>2021/12</Th>
                    <Th>2022/12(E)</Th>
                </tr>
                </thead> 
                <tbody>
                    {data?.data.data.map((data)=>(
                        <tr>
                            <Td>{data[0]}</Td>
                            <Td>{data[1]}</Td>
                            <Td>{data[2]}</Td>
                            <Td>{data[3]}</Td>
                            <Td>{data[4]}</Td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </Container>
    )
}

export default Ifrs;
import axios from 'axios';
import * as UserService from './user';
import state from '../store/state';

export const setAppConfig = params => axios.post(`${axios.PARK_API}app/info`, params).then(res => res);
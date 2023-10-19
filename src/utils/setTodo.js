import axios from 'axios'

export const setTodo = async(id) => {
    const response = await axios.get(`import.meta.env.BASE_ENDPOINT/api/todos/${id}`)
    return response.data
}
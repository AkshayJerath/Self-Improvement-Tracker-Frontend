'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get todos for a behavior
  const getTodos = async (behaviorId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/behaviors/${behaviorId}/todos`);
      setTodos(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching to dos');
      toast.error('Failed to fetch to dos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add todo to behavior
  const addTodo = async (behaviorId, todoData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`/behaviors/${behaviorId}/todos`, todoData);
      setTodos([res.data.data, ...todos]);
      toast.success('To do added successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding to do');
      toast.error('Failed to add to do');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update todo
  const updateTodo = async (id, todoData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.put(`/todos/${id}`, todoData);
      setTodos(
        todos.map((todo) => (todo._id === id ? res.data.data : todo))
      );
      toast.success('Todo updated successfully');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating to do');
      toast.error('Failed to update to do');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.put(`/todos/${id}/toggle`);
      setTodos(
        todos.map((todo) => (todo._id === id ? res.data.data : todo))
      );
      toast.success('Todo status updated');
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error toggling todo');
      toast.error('Failed to update to do status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success('To do deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting to do');
      toast.error('Failed to delete to do');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    error,
    getTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
};
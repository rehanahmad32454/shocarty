import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUser } from "../services/operations/userApi";
import { useDispatch, useSelector } from "react-redux";
export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const fetchUser = async () => {
    try {
      await dispatch(getUser());
    } catch (error) {
    } finally {
      setChecked(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, checked }}>
      {children}
    </AuthContext.Provider>
  );
}

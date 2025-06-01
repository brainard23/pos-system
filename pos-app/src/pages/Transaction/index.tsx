import Search from "@/components/core/Search";
import Layout from "@/components/Layout";
import { useState } from "react";

const Transaction = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Layout>
      <div className="p-2">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Search searchQuery={searchQuery} setQuery={setSearchQuery} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transaction;

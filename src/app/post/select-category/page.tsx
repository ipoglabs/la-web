'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePostFormStore } from '../store/postFormStore';
import { categoryIN } from '@/static/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

export default function SelectCategoryPage() {
  const router = useRouter();
  const params = useSearchParams();

  const reset     = usePostFormStore((s) => s.reset);
  const setField  = usePostFormStore((s) => s.setField);
  const setBulk   = usePostFormStore((s: any) => s.setBulk);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const categories = categoryIN.data;
  const currentCategory = categories.find((cat) => cat.id === selectedCategoryId);

  // --- Always start a brand-new post here ---
  useEffect(() => {
    // If you only want to reset when explicitly requested, uncomment:
    // if (params.get('fresh') === '1') reset();
    reset();
  }, [reset /*, params */]);

  const handleContinue = () => {
    if (currentCategory && selectedSubCategory) {
      // ensure fresh create (no leaked edit flags)
      if (typeof setBulk === 'function') {
        setBulk({ editMode: false, postId: undefined });
      } else {
        setField('editMode', false);
        setField('postId', undefined as any);
      }

      setField('category', currentCategory.name);
      setField('subcategory', selectedSubCategory);
      router.push('/post/details');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-lg shadow-xl border border-slate-200">
        <CardContent className="p-6 space-y-6">
          {/* Main Category */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Main Category</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-left">
                  {currentCategory?.name || 'Choose a category'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-64 overflow-y-auto">
                {categories.map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat.id}
                    checked={selectedCategoryId === cat.id}
                    onCheckedChange={() => {
                      setSelectedCategoryId(cat.id);
                      setSelectedSubCategory(null);
                    }}
                  >
                    {cat.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sub-category */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Sub-category</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left"
                  disabled={!selectedCategoryId}
                >
                  {selectedSubCategory ||
                    (!selectedCategoryId ? 'Select category first' : 'Choose Sub-category')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-64 overflow-y-auto">
                {currentCategory?.items.map((sub) => (
                  <DropdownMenuCheckboxItem
                    key={sub.id}
                    checked={selectedSubCategory === sub.itemName}
                    onCheckedChange={() => setSelectedSubCategory(sub.itemName)}
                  >
                    {sub.itemName}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Continue Button */}
          <div className="pt-4 border-t border-slate-200">
            <Button
              className="w-full"
              disabled={!selectedCategoryId || !selectedSubCategory}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

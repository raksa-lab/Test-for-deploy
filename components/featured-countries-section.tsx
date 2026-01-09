"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
import { FeaturedCountry, featuredStorage } from '@/lib/tips-storage';
import Image from 'next/image';

interface Country {
  name: { common: string };
  flags: { svg: string; png: string };
}

interface FeaturedCountriesSectionProps {
  allCountries: Country[];
}

export function FeaturedCountriesSection({ allCountries }: FeaturedCountriesSectionProps) {
  const [data, setData] = useState<{ featured: FeaturedCountry[]; featuredCountriesData: Country[] }>({
    featured: [],
    featuredCountriesData: [],
  });

  useEffect(() => {
    const featuredList = featuredStorage.getAllFeatured();

    // Match featured countries with actual country data
    const matched = featuredList
      .map(f => allCountries.find(c => c.name.common.toLowerCase() === f.name.toLowerCase()))
      .filter(Boolean) as Country[];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({ featured: featuredList, featuredCountriesData: matched });
  }, [allCountries]);

  const handleRemoveFeatured = (countryName: string) => {
    featuredStorage.removeFeatured(countryName);
    const updatedFeatured = featuredStorage.getAllFeatured();
    const updatedMatched = updatedFeatured
      .map(f => allCountries.find(c => c.name.common.toLowerCase() === f.name.toLowerCase()))
      .filter(Boolean) as Country[];
    setData({ featured: updatedFeatured, featuredCountriesData: updatedMatched });
  };

  if (data.featured.length === 0) {
    return null;
  }

  return (
    <Card className="w-full border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 fill-current text-accent" />
          Featured Countries ({data.featured.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.featuredCountriesData.map((country) => (
            <div key={country.name.common} className="relative group">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted transition-colors">
                <Image src={country.flags.svg || "/placeholder.svg"} alt={country.name.common} width={48} height={32} className="w-12 h-8 rounded object-cover" />
                <p className="text-xs font-semibold text-center">{country.name.common}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveFeatured(country.name.common)}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

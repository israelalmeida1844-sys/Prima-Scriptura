#include <sword/swmgr.h>
#include <sword/swmodule.h>
#include <sword/versekey.h>
#include <iostream>
#include <iomanip>
#include <string>
using namespace sword;
int main(int argc,char**argv){
 if(argc!=3)return 2;
 SWMgr mgr(argv[1]);
 SWModule *m=mgr.getModule(argv[2]);if(!m){std::cerr<<"Missing module\n";return 3;}
 VerseKey key;key.setVersificationSystem("KJV");key.setIntros(true);key.setPosition(TOP);
 size_t verses=0;
 while(!key.popError()){
   if(key.getBook()>0 && key.getChapter()>0 && key.getVerse()>0)++verses;
   m->setKey(&key);
   std::string val=m->getRawEntry();
   if(!val.empty()){
     std::cout<<int(key.getTestament())<<"\t"<<(key.getBook()>0?key.getOSISBookName():"_")<<"\t"<<key.getChapter()<<"\t"<<key.getVerse()<<"\t";
     for(unsigned char c:val)std::cout<<std::hex<<std::setw(2)<<std::setfill('0')<<int(c);
     std::cout<<std::dec<<"\n";
   }
   key.increment(1);
 }
 std::cerr<<"KJV verse keys: "<<verses<<"\n";
 return verses==31102?0:4;
}
